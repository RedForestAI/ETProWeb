import uvicorn
import tobii_pro_server

def run():
    
    uvicorn.run(
        "tobii_pro_server.main:app", 
        host="localhost", 
        port=9999, 
        reload=False, 
        log_level="debug", 
        workers=1, 
    )

if __name__ == "__main__":
    run()
