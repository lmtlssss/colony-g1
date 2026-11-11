# Colony G1 · public circuit fixtures

> **Status, 10 November 2026.** This corpus was published with speedrunpapi versions that judged circuits by matching source patterns. Those versions did not analyse the constraint system, and the timing comparison under `replay22/` measured that lookup against a solver. **The comparison is withdrawn.**
>
> The fixtures themselves are sound test material: each was written with a known answer. [speedrunpapi 0.7.1](https://github.com/lmtlssss/speedrunpapi), which compiles each circuit with circom and analyses the R1CS for output determinism, reaches the verdict listed below for all 18, with a derivation an independent checker replays or two checked witnesses. Reproduce with circom 2.x installed:
>
> ```sh
> npx --yes speedrunpapi@0.7.1 scan carry/modsum_safe_n4.circom -l lib/circomlib/circuits
> ```
>
> The `speedrunpapi@0.3.2` commands further down, and everything in `replay22/`, are kept only as a record of what was published.

The 18 original Colony Circom fixtures in the 22-case G1 replay are published here, byte-for-byte from the measured source corpus. The other three cases are upstream Picus benchmark circuits. Each clip's original `speedrunpapi@0.3.2` command remains reproducible. The current CLI is `0.5.1`.

Clone once:

```sh
git clone https://github.com/lmtlssss/colony-g1.git
cd colony-g1
npx --yes speedrunpapi@0.3.2 scan carry/modsum_safe_n4.circom --json
```

For a single case, download the linked .circom file, then scan its local pathname. `Certified` returns exit code 0; `Broken` returns 2 by design. The scope and original result are displayed in the CLI output. A Broken verdict can be a deliberate negative fixture, as indicated below.

| Circuit | Expected verdict | Rerun file |
| --- | --- | --- |
| [`modsum_safe_n4`](carry/modsum_safe_n4.circom) | Certified | `carry/modsum_safe_n4.circom` |
| [`modsum_safe_n8`](carry/modsum_safe_n8.circom) | Certified | `carry/modsum_safe_n8.circom` |
| [`modsum_safe_n16`](carry/modsum_safe_n16.circom) | Certified | `carry/modsum_safe_n16.circom` |
| [`modsum3_safe_n4`](carry/modsum3_safe_n4.circom) | Certified | `carry/modsum3_safe_n4.circom` |
| [`full_adder_bits`](carry/full_adder_bits.circom) | Certified | `carry/full_adder_bits.circom` |
| [`shared_input_parallel_m3_w8`](carry/shared_input_parallel_m3_w8.circom) | Certified | `carry/shared_input_parallel_m3_w8.circom` |
| [`cascade3_safe_n4`](carry/cascade3_safe_n4.circom) | Certified | `carry/cascade3_safe_n4.circom` |
| [`limb_add_safe_n4_k2`](limb/limb_add_safe_n4_k2.circom) | Certified | `limb/limb_add_safe_n4_k2.circom` |
| [`limb_add_safe_n4_k4`](limb/limb_add_safe_n4_k4.circom) | Certified | `limb/limb_add_safe_n4_k4.circom` |
| [`limb_add_safe_n8_k4`](limb/limb_add_safe_n8_k4.circom) | Certified | `limb/limb_add_safe_n8_k4.circom` |
| [`u4_add_safe_k8`](bitvm_model/u4_add_safe_k8.circom) | Certified | `bitvm_model/u4_add_safe_k8.circom` |
| [`modsum_no_bitify_n4`](buggy/modsum_no_bitify_n4.circom) | Broken | `buggy/modsum_no_bitify_n4.circom` |
| [`modsum_carry_not_bit_n4`](buggy/modsum_carry_not_bit_n4.circom) | Broken | `buggy/modsum_carry_not_bit_n4.circom` |
| [`full_adder_no_bit_checks`](buggy/full_adder_no_bit_checks.circom) | Certified | `buggy/full_adder_no_bit_checks.circom` |
| [`limb_add_missing_range_n4_k2`](buggy/limb_add_missing_range_n4_k2.circom) | Broken | `buggy/limb_add_missing_range_n4_k2.circom` |
| [`u4_add_buggy_k8`](bitvm_model/u4_add_buggy_k8.circom) | Broken | `bitvm_model/u4_add_buggy_k8.circom` |
| [`shared_input_no_bitify_m3_w8`](buggy/shared_input_no_bitify_m3_w8.circom) | Broken | `buggy/shared_input_no_bitify_m3_w8.circom` |
| [`cascade3_no_bitify_n4`](buggy/cascade3_no_bitify_n4.circom) | Broken | `buggy/cascade3_no_bitify_n4.circom` |

The 18 circuits use standard relative Circom includes. The required `lib/circomlib/` files are vendored with their original notices and license files so a Circom compiler can follow the imports. These are third-party sources by 0KIMS/circomlib, separate from the original Colony fixtures.

The other four G1 sources are three publicly maintained Picus benchmarks (`test_bigadd_15.circom`, `test_bigadd_23.circom`, `BinSum@binsum.circom`) and the circomlib SHA-256 compression benchmark. All four and their include files are pinned under `replay22/upstream/`. The [22-case reproducible replay](replay22/README.md) adds circomlib SHA-256 compression, includes the full upstream licenses, and produces a measured JSON leaderboard from the pinned CLI. The live [Colony leaderboard](https://colony.technology/leaderboard) and [checker](https://colony.technology/checker) display the published evidence.

To repeat a source-bound check with today's published package, substitute `speedrunpapi@0.5.1` in the same command. The source paths are unchanged.
