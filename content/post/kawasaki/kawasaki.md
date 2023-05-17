One of  the traditional  models that come  up time  and time
again  is the  Ising  model. Originally  developed to  study
ferromagnets, the  model is  considered one of  the simplest
models that exhibits &ldquo;complex&rdquo; behavior and has been applied
to study  a variety of  phenomena such as  opinion dynamics,
neural dynamics, segregation, and even criminal systems.

The Ising  model consists of a  collection of nodes $S  = \\{
s_1, \dots,  s_n \\}$  which contains a  alphabet $X  = \\{-1,
1 \\}$. That is, each &ldquo;vertex&rdquo;  or &ldquo;node&rdquo; contains a &ldquo;spin&rdquo; or
binary state representing up or down, opinion A or B, firing
or non-firing.

The system dynamics of  the Ising model occurs traditionally
by  Glauber update.  Each time  step $t$  a spins  is chosen
according to some function  $g(S)$. Traditionally, $g(S)$ is
chosen  to be  uniform over  the  nodes in  the system.  The
energy of the sampled node  is then computed compared to its
opposite state. That is, a proposal state is drawn uniformly
from $X$ and &ldquo;accepted&rdquo; using Metropolis-Hasting sampling

\begin{equation}
\begin{aligned}
A(s_i \to s_i') = \frac{ p(s_i') }{ p(s_i) }  = \Bigg \\{
    \begin{aligned}
     \exp( -\beta \Delta E) & \textrm{ if } \Delta E  < 0 \\\\
                             1 & \textrm{ otherwise }.\\\\
    \end{aligned}
\end{aligned}
\end{equation}

The difference in energy is given as

$$ \Delta E= \mathbb{H}(S') - \mathbb{H}(S)$$

with $\mathbb{H}(S)  = - \sum_{ij}  J_{ij} s_i s_j -  \sum_{i} h_i
s_i$, where $h_i$ represents some external magnetic field.

For  a   single  spin   difference  results   in  $$   \Delta  E=
\mathbb{H}(s_i')  - \mathbb{H}(s_i)$$  as the  difference in
energy for all other spins $s_j \in S$
cancels.

There are,  however, different update schemes.  One of which
is the Kawasaki  dynamic. In this way,  the magnetization of
the  system  remains  constant.  That  is,  each  node  gets
assigned a state and does not  change as a function of time.
Each simulation  step, a  radomly chosen  spin may  swap its
state with  its neighbor. That  is, a spin $s_i$  may choose
its  next  state $s_i'$  by  swapping  its state  with  some
neighbor $s_j$ such that $s_i' =  s_j$ and $s_j' = s_i$ with
transition $A(s_i, s_j \to s_i', s_j')$

\begin{equation}
\begin{aligned}
A(s_i, s_j \to s_i', s_j')_{\textrm{Kawasaki}} = \frac{ p(S') }{ p(S) }  = \Bigg \\{
    \begin{aligned}
     \exp( -\beta \Delta E) & \textrm{ if } \Delta E  < 0 \\\\
                             1 & \textrm{ otherwise }.\\\\
    \end{aligned}
\end{aligned}
\end{equation}

Note that here  the $\Delta E$ is computed over  a proposed state
$S'$ where the states of $s_i$ and $s_j$ are swapped.

Kawasaki  dynamics ensures  that  the average  magnetization
remains constant. The fraction of positive spins will remain
constant over  time. In  contrast, for Glauber  dynamics the
ratio  between  positive  and  negative  spins  may  change,
depending  on  the  temperature  $\beta =  \frac{1}{T}$  in  the
system. For  $T <  T_{C}$ tends to  magnetize the  system in
Ising    spin   systems    with    Glauber   dynamics    and
Metropolis-Hasting  upates. This  means that  if the  system
starts  with an  equal  propotion of  positive and  negative
spins, the  system will tend to  a state in which  all spins
are aligned. For Kawasaki dynamics, the spins &ldquo;move&rdquo; through
the  space.  Clustering will  occur,  similar  to the  Ising
dynamics  with Glauber  updates, but  no majority  will win.
Kawasaki dynamic can therefore be  used to study things like
segregation, gang-turf demarcation, echo-chambers and so on.
A difference between  the two dynamics is shown  can be seen
in fig.  [1](#org2e195c6) with $T  = 1$  and for a  4 state
potts model in fig. [2](#org8fec01e).

<figure>
<video autoplay controls><source src="./kawasaki.mp4"></video>
<figcaption> Glauber versus Kawasaki dynamics for a Ising model on regular 2D lattice of 64x64 spins.  </figcaption>
</figure>

<figure>
<video autoplay controls><source src="./kawasaki_4potts.mp4"></video>
<figcaption>
Glauber versus Kawasaki dynamics for a 4-state Potts model.
</figcaption>
</figure>

