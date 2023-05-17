---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Growing pains"
subtitle: "Setting up mu4e for office 365"
summary: "Setting up mu4e for office 365 with OAUTH2"
authors: []
tags: [emacs, coding]
categories: []
date: 2021-04-23T10:12:27+02:00
lastmod: 2021-04-23T10:12:27+02:00
featured: false
draft: false
highlight: true

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

A few months ago, my work email switched from outlook to office365 and with it came `OAUTH2`. The transition was coupled with a lack of initial support for receiving email with this security protocol yielding some email clients useless. The goal of this post is to provide future users with some insights on setting up `OAUTH2` in `mu4e`.

# What is `OAUTH2`?
In brief, `OAUTH2` is an authorization framework that enables applications to obtain limited access to user accounts through an HTTP service; applications can request access to user accounts by setting up a host-client secret. In my mind it works similar to ssh, but then for email.

# Setting up `OAUTH2` in `emacs`
We need to achieve 3 functions; we need to acquire a secret, use this secret to receive the emails, use this secret to send the emails. As an important aside, it is highly recommended to set up some form of password management such that your passwords are not visible of left strangling in clipboard; setting this up is outside the scope of this post. 

## Acquiring the secret
Acquiring the  secret may  differ depending  on the service  you are  using. For
gmail                    for                     example                    look
[here](https://support.google.com/googleapi/answer/6158849?hl=en).   For  office
365 however, it proved a bit more difficult as I did not have access directly to
the api to setup  these keys through azure. In order to acquire  a secret I used
[mutt_oauth2.py](https://gitlab.com/muttmua/mutt/-/blob/master/contrib/mutt_oauth2.py.README), and I used the publically available application id for thunderbird which can be found [here](https://hg.mozilla.org/comm-central/file/tip/mailnews/base/src/OAuth2Providers.jsm). At the time of writing these are

```
AppID = "08162f7c-0fd2-4200-a84a-f25a4db0b584"
ClientSecret = "TxRBilcHdC6WGBee]fs?QR:SJ8nI[g82"
```
Acquire `mutt_oauth2.py` and edit the code with this info. Running the file will then give you a token after logging in with the through your SSO of your company. Now this token is put in a public file, anyone who has acces to this token could theoretically scoop your email. It is therefore crucial to setup a password manager to protect this secret.

## Email receiving 
I use `mbsync` for receiving emails and `mstmp` for sending emails. I again defer to the respective tutorials for setting these up, but I will mention what is important for `XOAUTH2`. A common setup for `mbsync` could look something like this

``` 
#file: ~/.mbsyncrc
# mbsyncrc based on
# http://www.ict4g.net/adolfo/notes/2014/12/27/EmacsIMAP.html
# ACCOUNT INFORMATION
IMAPAccount office365
# Address to connect to
Host smtp.office365.com
User <EMAIL_HERE>
PassCmd "gpg2 -q --for-your-eyes-only --no-tty -d ~/.emacs.d/mu4e/.mbsyncpass-<EMAIL_HERE>.gpg"
AuthMechs LOGIN
SSLType IMAPS
SSLVersions TLSv1.3
CertificateFile /etc/ssl/certs/ca-certificates.crt


IMAPStore office365
Account office365

MaildirStore office365-local
SubFolders Verbatim
# The trailing "/" is important
Path ~/Mail/
Inbox ~/Mail/office365/inbox

Channel office365
Far :office365-remote:
Near :office365-local:
# Exclude everything under the internal [Gmail] folder, except the interesting folders
Patterns * ![office365]* "[office365]/Sent Mail" "[office365]/Starred" "[office365]/All Mail"
# Or include everything
#Patterns *
# Automatically create missing mailboxes, both locally and on the server
Create Both
# Save the synchronization state files in the relevant directory
SyncState *
```

`PassCmd` is used to obtain your client secret setup above and `Authmechs` needs to be set to `XOAUTH2` for office365 but oddly to `LOGIN` for gmail. One could also fill in a bare string password to prevent the hassle of setting up password managers, or use `python mutt_oauth2.py TOKENFILE` to acquire the secret but this is not recommended. We can check whether it works by running `mbsync -a` from your favorite shell.


# Email sending
Similar to the setup of `mbsync`, `msmtp` can be setup to use a password command
to  insert the  token.  Note that  you  need  to have  a  version that  supports
`xoauth2`, on AUR you can use `mstmp-oauth2`. A typical setup looks like this

```
#file : ~/.mstmprc 
# Set default values for all following accounts.
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        ~/.msmtp.log

# Outlook
account        outlook
host           smtp.office365.com
port           587
auth           xoauth2
from           username@outlook.com
# not necessary
# user           username
# not recommended
password       plain-text-password
# recommended
passwordeval   <Password retrieval command>
...

# Set a default account (optional)
account default : outlook
```
We can now receive and send email. As coup de grâce we have to setup mu4e to start using email from emacs.

# Mu4e
At the time of writing I am using doom emacs which has some wrappers for common long commands; substitute for default emacs accordingly. "Modern" mu4e uses contexts to setup various emails addresses. I will highlight the relevant parts for mu4e setup to make our setup work. In short, we need to tell `mu` use `mbsync` to retrieve emails and `msmtp` to send emails.


<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/languages/elisp.min.js"></script>
```lisp
(after! mu4e
 (setq
   ;; set correct path
   sendmail-program "/usr/sbin/msmtp"
   mu4e-root-maildir "~/Mail"
   mu4e-mu4e-mail-path "~/Mail"
   send-mail-function  'smtpmail-send-it
   ;; remove adding username --> msmtp takes care of this
   message-sendmail-f-is-evil t
   ;; read who is sending the email 
   message-sendmail-extra-arguments '("--read-envelope-from")
    (make-mu4e-context
     :name  "office365"
     :match-func (lambda (msg)
                   (when msg
                     (string-prefix-p "/office365" (mu4e-message-field msg :maildir)
                                      )
                     )
                   )
     :enter-func (lambda () (mu4e-message "Entering work contenxt"))
     ;; relevant bits
     :vars '(
             (mu4e-sent-folder . "/office365/Sent Items")
             (mu4e-drafts-folder . "/office365/Drafts")
             (mu4e-inbox-folder . "/office365/inbox")
             (smtpmail-local-domain . "office365")
             (smtpmail-smtp-server . "smtp.office365.com")
             (smtpmail-default-smtp-server . "smtp.office365.com")
             (user-mail-address . "<user email address")
             ;; name setup in mbsync
             (mu4e-get-mail-command . "mbsync office365")
             )
    )
  )
)
```

As a final step, we need to setup `mu` itself. From your favorite shell write:

```
mu init --maildir ~/Mail --my-address=<User address> && mu index
```
...and we are done! You can now use mu4e to send and receive emails from emacs, happy hacking :wink:!

<!-- # Setting up password manager -->
<!-- https://avaldes.co/2020/01/28/secret-service-keepassxc.html -->
<!-- # Using msmtp -->
<!-- https://tushartyagi.com/blog/configure-mu4e-and-msmtp/ -->
<!-- # Setting up different accounts  -->
<!-- https://www.djcbsoftware.nl/code/mu/mu4e/Contexts.html -->
