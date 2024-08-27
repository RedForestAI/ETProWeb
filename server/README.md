# ET Pro Server

To run the server, use the provided executable or install the ``et_pro_server`` package, using Python 3.10.

```term
pip install -e .
```

## HTTP vs HTTPS

For running the server in HTTP, use the CLI:

```term
$ et_pro_server --help
usage: et_pro_server [-h] [--host HOST] [--port PORT] [--reload RELOAD] [--log_level LOG_LEVEL] [--workers WORKERS]

options:
  -h, --help            show this help message and exit
  --host HOST           Host to run the server on
  --port PORT           Port to run the server on
  --reload RELOAD       Whether to reload the server on changes
  --log_level LOG_LEVEL
                        Log level
  --workers WORKERS     Number of workers
```

For HTTPS and Windows, you will require to install ``mkcert``. Here is a [guide](https://dev.to/rajshirolkar/fastapi-over-https-for-development-on-windows-2p7d). With Chocolately, use the following command:

```
$ choco install mkcert
$ mkcert -install # required once
```

Then run the server in HTTPS mode:

```
$ python -m et_pro_server.__exe__
```