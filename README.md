# Descripción

Proyecto de ejemplo para la autenticacion y generacion de token con Node.js y MySQL. Tambien permite insertar usarios en una BD de MySql para realizar pruebas

## Requerimientos

Para desarrollo solo necesitas tener instalado Node.js y MySql.

## Ejecución

Para ejecutar el proyecto seguir los siguientes pasos:

- Crear una BD con el nombre `userdb` y una tabla dentro de esa BD con el nombre `usertable`.

- Modificar los datos de acceso al servidor MySql en el archivo `.env`

- Ejecutar el comando `npm i` en la raiz del proyecto.

- Ejecutar el comando `npm run server` para ejecutar el proyecto en un entorno local.

- Las peticiones se escucharan por `http://localhost:3000`.

## Endpoints

`http://localhost:3000/createUser`
`http://localhost:3000/login`

`{
    "user": "Daniel",
    "password": "12345"
}`

## Docker

Si desea ejecutar el proyecto con docker, no es necesario crear BD ni tabla, solamente ejecutar los comandos de docker-compose pertinentes.

- docker-compose up (ejecuta el proyecto)

- docker-compose down (detiene la ejecucion del proyecto)

- docker-compose build (necesario para reconstruir la imagen de la app si se modificaron los archivos)
