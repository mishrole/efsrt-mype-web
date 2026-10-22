# MYPE Web

Aplicación web para registrar y consultar la información financiera de una MYPE. Incluye autenticación, selección de negocio, categorías de producto, productos, borradores de ventas y gastos, evidencias, historial financiero y dashboard.

## Tecnologías principales

- React 19 y TypeScript.
- React Router 8.
- Vite.
- Zustand para estado global.
- React Hook Form y Zod para formularios y validación.
- Recharts para visualizaciones.
- Vitest y Testing Library para pruebas.
- ESLint y Prettier para calidad y formato.

## Requisitos

Instale antes de comenzar:

- Node.js en una versión compatible con las dependencias del proyecto.
- pnpm.
- API de MYPE ejecutándose o desplegada.

## Instalación

1. Clone el repositorio y entre en su carpeta.

```bash
git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd <CARPETA_DEL_REPOSITORIO_FRONTEND>
```

2. Instale las dependencias respetando `pnpm-lock.yaml`.

```bash
pnpm install --frozen-lockfile
```

3. Cree el archivo local de variables a partir del ejemplo.

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Configure la URL base de la API en `.env`.

```dotenv
VITE_API_BASE_URL=https://localhost:7020
```

`VITE_API_BASE_URL` es obligatoria. La aplicación detiene el inicio si la variable no existe o está vacía.

## Ejecución local

Inicie el servidor de desarrollo:

```bash
pnpm dev
```

Abra la dirección que muestre React Router en la terminal.

La API debe permitir por CORS el origen local del frontend. En desarrollo, el backend acepta orígenes loopback cuando no se configura una lista explícita.

## Construcción y ejecución del build

Genere el build de producción:

```bash
pnpm build
```

Ejecute el build generado:

```bash
pnpm start
```

El servidor utiliza `build/server/index.js` como entrada.

## Validación de calidad

Ejecute toda la validación local:

```bash
pnpm verify
```

El comando ejecuta, en orden:

1. Generación de tipos de React Router y comprobación de TypeScript.
2. ESLint.
3. Verificación de formato con Prettier.
4. Pruebas con Vitest.

Comandos individuales:

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test:run
pnpm test:coverage
```

Modo interactivo de Vitest:

```bash
pnpm test
```

Corrección automática de lint y formato:

```bash
pnpm fix
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---:|---|
| `VITE_API_BASE_URL` | Sí | URL base del backend, sin agregar manualmente las rutas `/api/v1`. |

Ejemplo local:

```dotenv
VITE_API_BASE_URL=https://localhost:7020
```

Ejemplo desplegado:

```dotenv
VITE_API_BASE_URL=https://<APP_SERVICE_BACKEND>
```

## Estructura principal

```text
app/
├── features/
│   ├── auth/
│   ├── business/
│   ├── dashboard/
│   ├── financial-movements/
│   ├── product-categories/
│   └── products/
├── services/
├── shared/
├── test/
└── routes.ts
```

- `features`: pantallas, componentes y estado de cada módulo funcional.
- `services`: contratos HTTP organizados por recurso y operación.
- `shared`: configuración, componentes, constantes, hooks y utilidades reutilizables.
- `test`: pruebas automatizadas que reflejan la estructura de la aplicación.
- `routes.ts`: registro de rutas de React Router.

## Rutas funcionales principales

```text
/login
/register
/dashboard
/product-categories
/product-categories/create
/product-categories/:productCategoryId
/products
/products/create
/products/:productId
/financial-movements
/financial-movements/drafts
/financial-movements/create/:movementType
/financial-movements/:movementId
```

- `/financial-movements`: historial financiero.
- `/financial-movements/drafts`: listado operativo de borradores.
- `/financial-movements/:movementId`: detalle histórico o flujo editable cuando corresponde a un borrador.

## Integración con el backend

El frontend consume rutas bajo `/api/v1`, entre ellas:

- Autenticación y renovación de sesión.
- Negocios y contexto autorizado.
- Categorías financieras y categorías de producto.
- Productos.
- Borradores, ítems, evidencias, confirmación e historial financiero.
- Dashboard financiero.

Para el funcionamiento local conjunto:

1. Ejecute primero el backend.
2. Configure `VITE_API_BASE_URL` con su URL HTTPS.
3. Ejecute `pnpm dev`.

## Solución de problemas

### `VITE_API_BASE_URL is not configured`

Cree `.env` y asigne una URL no vacía:

```dotenv
VITE_API_BASE_URL=https://localhost:7020
```

### Error de CORS

Verifique que:

- La URL configurada corresponda al backend en ejecución.
- El origen mostrado por `pnpm dev` esté permitido por el backend.
- No exista una diferencia entre HTTP y HTTPS.

### Error de certificado local

Confíe en el certificado de desarrollo de .NET y reinicie el navegador:

```bash
dotnet dev-certs https --trust
```

### Las pruebas o el build usan dependencias distintas

Reinstale desde el archivo de bloqueo:

```bash
rm -rf node_modules
pnpm install --frozen-lockfile
```

En PowerShell:

```powershell
Remove-Item node_modules -Recurse -Force
pnpm install --frozen-lockfile
```

## Despliegue

El frontend está preparado para desplegarse en Azure Static Web Apps. Configure `VITE_API_BASE_URL` durante la compilación con la URL pública del backend y asegure que ese origen esté autorizado mediante CORS en la API.
