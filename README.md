# tree-recursive

To create the **Tree function** for usable showing file structure in a directory. The utility should accept necessary parameters as input - path directory for showing its structure. Also, it should understand option `--depth` or `-d` as displaying depth. Example:
```bash
tree Node.js -d 2

Node.js
├── cluster
│ └── index.js
├── domain
│ ├── error.js
│ ├── flow.js
│ └── run.js
├── errors
│ ├── counter.js
│ └── try-catch.js
└── worker
└── index.js

4 directories, 7 files