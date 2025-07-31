<p align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular Logo" width="180"/>
</p>

# Link Shortener Frontend

## Descripción general

**Link Shortener Frontend** es una aplicación web avanzada desarrollada en [Angular](https://angular.io/) y TypeScript, diseñada para interactuar con la API de acortamiento de enlaces, gestionar usuarios, visualizar analíticas y ofrecer una experiencia de usuario moderna, segura y responsiva. Este frontend implementa arquitectura modular, gestión de estado reactiva, lazy loading, autenticación robusta y una UI construida exclusivamente con Tailwind CSS, siguiendo los más altos estándares de la industria.

---

## ⚙️ Características Principales

- **Autenticación y Autorización:** Inicio de sesión y registro local, integración con Google OAuth 2.0, gestión de sesiones seguras con JWT.
- **Gestión de Enlaces:** Creación, edición, eliminación y visualización de enlaces cortos, soporte para alias personalizados, protección por contraseña y expiración automática.
- **Panel de Analíticas:** Visualización avanzada de clics, dispositivos, ubicación geográfica y tendencias de uso, todo en tiempo real.
- **Gestión de Usuarios y Roles:** Interfaz de administración para gestionar usuarios, roles (ADMIN, PREMIUM, FREE) y permisos.
- **Sistema de Recuperación de Contraseña:** Envío de correo electrónico con enlace seguro y autodestructivo (válido por 5 minutos) para restablecer la contraseña. Los enlaces se invalidan automáticamente después de su uso o al expirar, garantizando la máxima seguridad.
- **Experiencia de Usuario Premium:** UI responsiva, accesible y moderna, animaciones suaves, dark mode y componentes reutilizables.
- **Gestión de Errores y Feedback:** Manejo global de errores, notificaciones contextuales y validación de formularios reactivos con mensajes personalizados.
- **Internacionalización (i18n):** Soporte multi-idioma preparado para escalabilidad global.
- **Seguridad:** Protección avanzada de rutas, guards personalizados y sanitización de datos.
- **Testing Extensivo:** Pruebas unitarias y de integración con alta cobertura, asegurando calidad y estabilidad continua.
- **Integración CI/CD:** Listo para despliegue automatizado en entornos productivos usando Docker y pipelines modernos.

---

## 🚀 Tecnologías Utilizadas

- **Framework:** [Angular 18+](https://angular.io/), [TypeScript](https://www.typescriptlang.org/)
- **Gestión de Estado:** Signals, RxJS, Angular Reactive Forms
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Autenticación:** JWT, Google OAuth 2.0
- **Testing:** [Jest](https://jestjs.io/), [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)
- **Linting & Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Internacionalización:** [@angular/localize](https://angular.io/guide/i18n)
- **Contenerización:** [Docker](https://www.docker.com/)
- **CI/CD:** GitHub Actions, Docker Compose
- **Herramientas Dev:** [Husky](https://typicode.github.io/husky/), [Commitlint](https://commitlint.js.org/), [Conventional Commits](https://www.conventionalcommits.org/)

---

## Tabla de contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Instalación

1. **Cloná el repositorio:**

   ```bash
   git clone https://github.com/Lucascabral95/links-shorteners-linkly.git
   cd frontend-links-shorteners
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   - Copiá `.env.template` a `.env` si existe.
   - Completá las variables requeridas, como la URL de la API backend y credenciales de Google.

4. **Configura Tailwind y estilos:**

   - Tailwind ya está preconfigurado en `tailwind.config.js` y los estilos globales en `src/styles.css`.

5. **Compila el proyecto:**
   ```bash
   npm run build
   ```

---

## Uso

### Modo Desarrollo

```bash
npm run start
```

La aplicación estará disponible en:

```
http://localhost:4200
```

### Modo Producción

```bash
npm run build
npm run preview
```

---

## Estructura del proyecto

```
frontend-links-shorteners/
│
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── admin/         # Panel de administración y gestión de usuarios/roles
│   │   │   ├── analytics/     # Analíticas y visualización de datos de clics
│   │   │   ├── auth/          # Autenticación (login, registro, OAuth, guards)
│   │   │   ├── clicks/        # Lógica de gestión y visualización de clics
│   │   │   ├── configuration/ # Configuración avanzada y settings de usuario
│   │   │   ├── dashboard/     # Dashboard principal
│   │   │   ├── landing/       # Página de aterrizaje y onboarding
│   │   │   ├── links/         # CRUD de enlaces cortos
│   │   │   ├── redirect/      # Redirección y manejo de enlaces cortos
│   │   │   └── users/         # Perfil y gestión de usuarios
│   │   ├── shared/
│   │   │   ├── components/    # Componentes UI reutilizables
│   │   │   ├── guards/        # Guards personalizados de rutas
│   │   │   ├── interceptors/  # Interceptores HTTP globales
│   │   │   └── utils/         # Utilidades y helpers generales
│   │   ├── app.component.ts   # Componente raíz
│   │   ├── app.routes.ts      # Rutas principales y lazy loading
│   │   └── ...
│   ├── environments/          # Configuración de entornos
│   ├── index.html             # HTML principal
│   ├── main.ts                # Bootstrap de la app
│   └── styles.css             # Estilos globales (Tailwind)
│
├── .vscode/                   # Configuración para VSCode (recomendado)
├── .editorconfig              # Reglas de estilo de código
├── .gitignore                 # Archivos ignorados por Git
├── angular.json               # Configuración de Angular CLI
├── package.json               # Dependencias y scripts de npm
├── tsconfig*.json             # Configuración de TypeScript
├── Dockerfile                 # Imagen Docker lista para producción
├── docker-compose.yml         # Orquestación de servicios (frontend, backend, db)
├── README.md                  # Este archivo
└── ...otros archivos de configuración
```

---

## Contribuciones

¡Las contribuciones son bienvenidas! Seguí estos pasos:

1. Hacé un fork del repositorio.
2. Creá una rama para tu feature o fix (`git checkout -b feature/nueva-funcionalidad`).
3. Realizá tus cambios y escribí pruebas si es necesario.
4. Hacé commit y push a tu rama (`git commit -m "feat: agrega nueva funcionalidad"`).
5. Abrí un Pull Request describiendo tus cambios.

---

## Licencia

Este proyecto está bajo la licencia **UNLICENSED**.

---

## 📬 Contacto

- **Autor:** Lucas Cabral
- **LinkedIn:** [https://www.linkedin.com/in/lucas-gast%C3%B3n-cabral/](https://www.linkedin.com/in/lucas-gast%C3%B3n-cabral/)
- **Portfolio:** [https://portfolio-web-dev-git-main-lucascabral95s-projects.vercel.app/](https://portfolio-web-dev-git-main-lucascabral95s-projects.vercel.app/)
- **Github:** [https://github.com/Lucascabral95](https://github.com/Lucascabral95/)

---

```bash
ng build
```

Este comando compilará tu proyecto y guardará los archivos resultantes en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para obtener el máximo rendimiento y velocidad.

## Ejecutando pruebas unitarias

Para ejecutar las pruebas unitarias con el ejecutor de pruebas [Karma](https://karma-runner.github.io), usá el siguiente comando:

```bash
ng test
```

## Ejecutando pruebas end-to-end (e2e)

Para ejecutar las pruebas de extremo a extremo, usá:

```bash
ng e2e
```
