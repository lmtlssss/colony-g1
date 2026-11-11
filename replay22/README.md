> **Withdrawn.** This replay timed a pattern lookup in pre-0.7.1 speedrunpapi against a solver. It did not measure an analysis. It is kept as a record only; see the repository README.

# G1 / 22-circuit pinned replay

Reproduce the Colony source and verdict checks, then measure the same warm core analyzer that `speedrunpapi@0.3.2` uses.

```sh
git clone https://github.com/lmtlssss/colony-g1.git
cd colony-g1
bash replay22/run_all.sh
```

`run_all.sh` installs **speedrunpapi 0.3.2** in an isolated temporary directory. It checks the SHA-256 checksum and the expected Colony verdict for every one of the 22 source files, warms the analyzer for 100 calls per circuit, and records the median of 750 analyzer calls per circuit. It writes `replay22/colony-benchmark-replay.json`. The exact source and verdict checks reproduce; timing varies with hardware and clock resolution.

The public bundle includes all 18 Colony G1 circuit fixtures, three Picus benchmark entry points, the circomlib SHA-256 entry point, and their include dependencies. `manifest.json` binds each source to its expected verdict, Picus historical timing, and raw file checksum.

### Reading the acceleration

The denominator is the timed verification core from the pinned CLI. It excludes source file loading and Circom classification, as in the CLI's `time_ms` field. The numerator is the historical Picus solver wall time from the G1 lab. For SHA-256 the Picus run reached its **180-second timeout**, so its ratio is a lower-bound comparison against that budget. This is a comparison of the specified measurement surfaces, not an estimate of full customer request latency.

The operator's earlier 22-case replay reported a 260,880× minimum, 10.5M× median, and 1,512,668,983× SHA-256 peak. This repository also includes a fresh pinned Mac replay. It independently reproduces the 22/22 verdicts, checksums, and billion-scale SHA ratio. The source-derived result file records the new measurements and the earlier reported reference as separate fields.

### Source and licenses

- `carry/`, `limb/`, `buggy/`, `bitvm_model/`: original Colony G1 fixtures.
- `replay22/upstream/`: Picus benchmark snapshots and their source dependencies.
- `replay22/LICENSES/circomlib-LGPL-3.0.txt`: original circomlib LGPL-3.0 license.
- `replay22/LICENSES/GPL-3.0.txt`: full GNU GPL-3.0 text incorporated by LGPL-3.0.
- `replay22/LICENSES/Picus-MIT.txt`: Picus license.

For a single file, use `npx --yes speedrunpapi@0.3.2 scan carry/modsum_safe_n4.circom --json`; select the matching path from `manifest.json` for other cases. Broken is an intentional verdict for negative fixtures and returns exit code 2.
