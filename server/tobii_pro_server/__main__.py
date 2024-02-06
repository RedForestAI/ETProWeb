import uvicorn
import argparse

def run():
    
    # Handle arguments 
    args = argparse.ArgumentParser()
    args.add_argument("--host", type=str, default="localhost", help="Host to run the server on")
    args.add_argument("--port", type=int, default=9999, help="Port to run the server on")
    args.add_argument("--reload", type=bool, default=True, help="Whether to reload the server on changes")
    args.add_argument("--log_level", type=str, default="debug", help="Log level")
    args.add_argument("--workers", type=int, default=1, help="Number of workers")
    
    # Parse arguments
    args = args.parse_args()
    
    uvicorn.run(
        "tobii_pro_server.main:app", 
        host=args.host, 
        port=args.port, 
        reload=args.reload, 
        log_level=args.log_level, 
        workers=args.workers, 
    )

if __name__ == "__main__":
    run()
