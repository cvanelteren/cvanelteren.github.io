import proplot as plt, cmasher as cmr, pandas as pd,\
           numpy as np, warnings,\
           re
from scipy import integrate
from tqdm import tqdm
from itertools import product
warnings.simplefilter("ignore")


def payoffs(x: np.ndarray, beta, gamma, alpha: float) -> np.ndarray:
    o, p, c = x
    pi_o = -beta * c
    pi_p = gamma * c - alpha
    pi_c = beta * o  + (beta - 1) * p
    return (pi_o, pi_p, pi_c)

def update(t: float, x: np.ndarray, beta, gamma, alpha: float) -> np.ndarray:
    # Using replicator dynamics
    # we need to determined the payoff and the average fitness
    o, p, c = x
    n = o + p + c
    pi_o, pi_p, pi_c = payoffs(x, beta, gamma, alpha)
    # Average payoff
    pi_avg = o * pi_o + p * pi_p + c * pi_c

    # Replicator dynamics equations
    do = o / n * (pi_o - pi_avg)
    dp = p / n * (pi_p - pi_avg)
    dc = c / n * (pi_c - pi_avg)
    z = np.sum([do, dp, dc])
    #assert np.allclose(z, 0), z
    return [do, dp, dc]

def simulate(settings):
    alphas = np.linspace(0.0, 1.2, 100)
    betas  = np.linspace(0, 2, 100)
    t_span = settings.get("t_span", (0, 10))
    t = np.linspace(*t_span, 30)
    colors = np.zeros((alphas.size, betas.size, 3))

    x0 = settings.get("x0", np.ones(3) / 3)
    df = [{} for _ in range(alphas.size * betas.size)]
    pbar = tqdm(total = alphas.size * betas.size)
    gamma = 1.0
    for idx, (alpha, beta) in enumerate(product(alphas, betas)):
        res = integrate.solve_ivp(update, t_span = t_span,
                            y0 = x0,
                            args = (beta, gamma, alpha),
                            t_eval = t,
                            )

        df[idx] = dict(beta = beta,
                    gamma = gamma,
                    alpha = alpha,
                    y = res.y,
                    )

        pbar.update(1)
    return pd.DataFrame(df)


def make2d(df):
    alphas = np.unique(df.alpha)
    betas = np.unique(df.beta)
    img = np.zeros((len(alphas), len(betas)))
    for idx, (alpha, beta) in tqdm(enumerate(product(alphas, betas))):
        tmp = df.query("alpha == @alpha and beta == @beta")
        s  = np.stack(tmp.y).squeeze()[-1][..., -1]
        img.ravel()[idx] = s
    return img

df = simulate({})
betas = np.unique(df.beta)
alphas = np.unique(df.alpha)
plt.use_style("poster white_text".split())
colors = make2d(df)

y = np.stack(df.y)
print(y.min(), y.max(), y.sum(1)[-1,-1])
print(colors.shape, alphas.shape)

fig, ax = plt.subplots(journal = "nat1")
h = ax.imshow(colors, extent = [alphas.min(), alphas.max(), betas.min(), betas.max()], origin = "lower", cmap = "lapaz_r", vmin = 0, vmax = 1)
fig.colorbar(h, title = "Crime rate")
ax.format(xlabel = r"Inspection cost ($\alpha$)", ylabel = r"Temptation ($\beta$)")
ax.grid(0)
ax.axis("equal")
fig.savefig("./figures/phase_fully.png", dpi = 300)
fig.show()
print("Done")
plt.show(block = 1)
