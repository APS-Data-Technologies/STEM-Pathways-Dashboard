"""Execute notebook cells in order in-process when this host prohibits kernel sockets.

This preserves real cell outputs using IPython; it does not claim a Colab kernel run.
Usage: python scripts/run_notebook.py
"""
import os
from pathlib import Path
import nbformat
from IPython.core.interactiveshell import InteractiveShell
from IPython.utils.capture import capture_output
ROOT=Path(__file__).resolve().parents[1]
os.chdir(ROOT)
p=ROOT/'notebooks/clean_ipeds.ipynb'
notebook=nbformat.read(p,as_version=4)
shell=InteractiveShell.instance()
count=0
for cell in notebook.cells:
    if cell.cell_type!='code': continue
    count+=1
    with capture_output(stdout=True,stderr=True,display=True) as captured:
        result=shell.run_cell(cell.source,store_history=True)
    result.raise_error()
    outputs=[]
    if captured.stdout: outputs.append(nbformat.v4.new_output('stream',name='stdout',text=captured.stdout))
    if captured.stderr: outputs.append(nbformat.v4.new_output('stream',name='stderr',text=captured.stderr))
    for output in captured.outputs:
        outputs.append(nbformat.v4.new_output('display_data',data=output.data,metadata=output.metadata))
    cell.outputs=outputs;cell.execution_count=count
    print(f'PASS: code cell {count}',flush=True)
notebook.metadata['execution_method']='IPython in-process; host blocks TCP and IPC kernel sockets. Colab UI execution requires teammate verification.'
nbformat.write(notebook,p)
print(f'PASS: {count} notebook code cells executed in order; outputs saved.')
