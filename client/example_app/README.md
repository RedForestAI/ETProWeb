# Example Application using Vite+TS+React

For running the application first connect the Tobii Pro SDK device and start the FastAPI server. Then install the dependencies of the front-end application with the following command:

```term
npm install
``

Then run the application:

```term
npm run dev
```

## HTTP vs HTTPS

For testing the front and backend for production readiness, both sides of communicate should be the same. The backend can be altered in SSL context by which entrypoint (EXE, CLI, or Python command) is used. For the front-end, HTTPS is default. To change to HTTP, modifiy the ``vite.config.ts`` to remove the HTTPS configuration, like this:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```