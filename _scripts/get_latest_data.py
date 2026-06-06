# This script copies in the latest built data.
# It makes some assumptions about the local layout of repos and directories,
# which are hopefuly clear enough from the logic.

from pathlib import Path
import subprocess
import tempfile

# change these if the repo names on local disk change
# (and we assume that all three repos are side-by-side)
PIPELINE_DIR_NAME = 'pipeline'

# these should change less often or never
THIS_SCRIPT = __file__
THIS_REPO_DIR = (Path(THIS_SCRIPT) / '..' / '..').resolve()
CONTAINING_DIR = THIS_REPO_DIR / '..'
PIPELINE_REPO_DIR = (CONTAINING_DIR / PIPELINE_DIR_NAME).resolve()
PIPELINE_OUTPUTS_DIR = PIPELINE_REPO_DIR / 'out'
JSON_FILES = ['editions.json', 'cards.json', 'printings.json']

DATA_TARGET_DIR = THIS_REPO_DIR / 'feelings' / 'data'

# checks to make sure we've got the structures we expect
assert THIS_REPO_DIR.is_dir()
assert PIPELINE_OUTPUTS_DIR.is_dir()
for json in JSON_FILES:
    assert (PIPELINE_OUTPUTS_DIR / json).is_file()
assert DATA_TARGET_DIR.is_dir()

print(f"{THIS_REPO_DIR=}")
print(f"{PIPELINE_OUTPUTS_DIR=}")

def run_git(work_dir, *args):
    """Run a Git subcommand, return its stdout if it's successful, raise if it exits non-zero"""
    proc = subprocess.run(
        ["git", *args],
        capture_output=True,
        text=True,
        cwd=work_dir,
    )
    if proc.returncode != 0:
        raise SystemError(proc)
    return proc.stdout

pipeline_branch = run_git(PIPELINE_REPO_DIR, "symbolic-ref", "--short", "HEAD").strip()
if pipeline_branch != 'main':
    print("WARNING: 🔧 Pipeline repo is not at main")
    print(f"It's at `{pipeline_branch}`")
    input("Ctrl-C to cancel, otherwise press Enter to accept...")

pipeline_id = run_git(PIPELINE_REPO_DIR, "rev-parse", "HEAD").strip()

print()
print("Assumption: you recently generated the outputs in the pipeline directory.")
print("If that isn't true, bail out and do that first.")
input("Last chance to bail (Ctrl-C to stop, Enter to go)...")

print("Copying JSON data")
for json in JSON_FILES:
    print(f"- {json}")
    (PIPELINE_OUTPUTS_DIR / json).copy(DATA_TARGET_DIR / json)

print("Preparing commit")
run_git(DATA_TARGET_DIR, "add", ".")

commit_msg = f"""Updating data files

moodswingsdata/moodswingsdatapipeline {pipeline_id}
"""
print("Commiting changes")
print("-" * 40)
print(commit_msg)
print("-" * 40)
run_git(THIS_REPO_DIR, "commit", "-m", commit_msg)
