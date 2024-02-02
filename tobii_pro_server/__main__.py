import uvicorn

def run():
    uvicorn.run(
        "tobii_pro_server.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=False, 
        log_level="debug", 
        workers=1, 
    )

if __name__ == "__main__":
    run()
