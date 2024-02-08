import uvicorn
import tobii_pro_server
import pathlib

CURRENT_DIR = pathlib.Path(__file__).parent
cert_file = CURRENT_DIR / "cert.pem"
key_file = CURRENT_DIR / "key.pem"
assert cert_file.exists()
assert key_file.exists()

def run():
    
    uvicorn.run(
        "tobii_pro_server.main:app", 
        host="localhost", 
        port=9999, 
        reload=False, 
        log_level="debug", 
        workers=1,
        ssl_keyfile=str(key_file),
        ssl_certfile=str(cert_file),
    )

if __name__ == "__main__":
    run()
