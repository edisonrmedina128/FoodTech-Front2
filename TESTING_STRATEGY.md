# Testing Strategy - FoodTech

---

# PARTE 1: TEORÍA

## 1.1 TDD (Red - Green - Refactor)

**¿Qué es TDD?**
Desarrollo dirigido por pruebas: escribimos el test primero (RED), luego el código mínimo para pasar (GREEN), luego refactorizamos.

| Fase | Qué hacemos | Resultado |
|------|-------------|-----------|
| **RED** | Escribimos el test antes del código | Test falla |
| **GREEN** | Escribimos código mínimo para pasar | Test pasa |
| **REFACTOR** | Mejoramos código sin romper tests | Tests siguen pasando |

**Ejemplo:**
1. RED: Escribo test "login exitoso debe guardar token" → falla (no existe código)
2. GREEN: Escribo código mínimo para guardar token → test pasa
3. REFACTOR: Mejoro el código manteniendo funcionalidad

---

## 1.2 ¿Qué es Verificar?

- **Fase TDD:** GREEN - nos dice que el código funciona
- **Pregunta:** ¿El código funciona correctamente?
- **Ejemplos:** ¿La función retorna el valor esperado? ¿El endpoint se llama bien?

---

## 1.3 ¿Qué es Validar?

- **Fase RED (al inicio) + GREEN:** Protegemos el negocio
- **Pregunta:** ¿El negocio está protegido?
- **Ejemplos:** ¿Token expirado = sin acceso? ¿Credenciales wrong = no crea sesión?

---

## 1.4 ¿Qué es QA vs Testing?

| Concepto | Descripción |
|----------|-------------|
| **Testing** | Ejecutar scripts para verificar que el código funciona. Pregunta: "¿pasa o falla?" |
| **QA (Quality Assurance)** | Estrategia integral para garantizar calidad. Pregunta: "¿qué protegemos?" |

---

## 1.5 Workflow TDD (Basado en ai.workflow.md)

**¿Cómo trabajamos?**
Cada feature sigue un proceso estructurado:

| Paso | Fase | Acción | Herramienta | Resultado |
|------|------|--------|-------------|-----------|
| 1 | - | Load Context | glob, read files | Estructura del proyecto |
| 2 | - | Analyze Requirements | read tests, models, services | Entender la HU |
| 3 | **RED** | Write Tests First | write test file | Tests fallan ✗ |
| 4 | **RED** | Run Tests Verify | npm test -- --run | Verificar fallan ✗ |
| 5 | **GREEN** | Implement Feature | write implementation | Código mínimo |
| 6 | **GREEN** | Run Tests Verify | npm test -- --run | Tests pasan ✓ |
| 7 | **REFACTOR** | Improve Code | edit code | Código mejor |
| 8 | - | Final Verification | lint, typecheck, test | Todo pasa ✓ |

### Flujo TDD Resumido

```
1. Write Test → FAIL (red) ✗
2. Implement Code → PASS (green) ✓
3. Refactor → PASS (green) ✓
4. Lint + Typecheck → ✓
```

### Relación con Historias de Usuario

Cada HU sigue este workflow:

```
HU → Analyze Requirements → RED (tests) → GREEN (código) → Refactor → Historial.md
```

**Ejemplo (Registro de Usuario):**
1. Leer HU-FRONT-002
2. Escribir tests de registro (RED) → 5 tests
3. Implementar authService.register (GREEN)
4. Escribir tests de useAuth.register (RED)
5. Implementar useAuth.register (GREEN)
6. Actualizar LoginView toggle
7. Actualizar HISTORIAL.md con commits

---

# PARTE 2: AUTH SERVICE (Tests 01-15)

## 2.1 Tests que Verifican (GREEN)

### Test 01: 01-auth-login-exitoso.test.ts

**TDD:** GREEN - Primero escribimos el test, luego el código

**Qué hace:**
Este test verifica que cuando un usuario hace login con credenciales correctas, el sistema retorna true y guarda el token en localStorage.

**Código:**
```typescript
it('debe hacer login exitoso y guardar token en localStorage', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ token: 'fake-jwt-token-12345' })
  })
  const { authService } = await import('../../services/authService')
  const result = await authService.login('test@restaurant.com', 'password123')
  expect(result).toBe(true)
  expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token-12345')
})
```

**Mocks:**
- `global.fetch` - Simula respuesta exitosa del servidor

**Texto para presentación:**
> "Este test verifica el flujo feliz: login con credenciales correctas. Mockeo fetch para simular que el servidor retorna un token, y verifico que ese token se guarde en localStorage."

---

### Test 04: 04-auth-login-remember-false.test.ts

**Qué hace:**
Verifica que cuando el usuario NO marca "recordarme", el token se guarda sin fecha de expiración.

**Texto para presentación:**
> "Este test verifica que cuando el usuario NO marca 'recordarme', el token se guarda sin fecha de expiración. Es decir, la sesión dura solo mientras el navegador está abierto."

---

### Test 05: 05-auth-login-remember-true.test.ts

**Qué hace:**
Verifica que cuando el usuario marca "recordarme", el token se guarda CON fecha de expiración.

**Texto para presentación:**
> "Este test verifica lo contrario: cuando el usuario marca 'recordarme', el sistema guarda también la fecha de expiración del token para mantener la sesión activa."

---

### Test 06: 06-auth-logout-token.test.ts

**Qué hace:**
Verifica que la función logout() remueve completamente el token de localStorage.

**Texto para presentación:**
> "Este test verifica que el logout funciona: cuando el usuario cierra sesión, el token debe desaparecer del almacenamiento. Sin mocks, pruebo la función directamente."

---

### Test 07: 07-auth-getToken.test.ts

**Qué hace:**
Verifica que getToken() retorna exactamente el token guardado en localStorage.

**Texto para presentación:**
> "Este test verifica que getToken funciona correctamente: retorna exactamente lo que está guardado. Sin mocks, es una verificación directa de la lógica."

---

### Test 09: 09-auth-isAuthenticated-true.test.ts

**Qué hace:**
Verifica que con token válido, isAuthenticated() retorna true.

**Texto para presentación:**
> "Este test verifica que isAuthenticated retorna true cuando hay un token. Sin mocks, pruebo que la función detecta correctamente un token válido."

---

### Test 12: 12-auth-register-exitoso.test.ts

**Qué hace:**
Verifica que el registro retorna true cuando el servidor responde exitosamente.

---

### Test 15: 15-auth-register-request.test.ts

**Qué hace:**
Verifica que el registro llama al endpoint correcto '/auth/register' con método POST y datos correctos.

**Texto para presentación:**
> "Este test verifica la ARQUITECTURA: que el registro llama al endpoint correcto con los datos correctos."

---

## 2.2 Tests que Validan (RED → GREEN)

### Test 02: 02-auth-login-invalidas.test.ts

**TDD:** RED → GREEN - Primero escribimos el test de validación

**Qué hace:**
Valida que credenciales inválidas (email/password wrong) lanzan error "Credenciales inválidas".

**Código:**
```typescript
it('debe lanzar error cuando credenciales son inválidas', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 401
  })
  const { authService } = await import('../../services/authService')
  await expect(
    authService.login('wrong@email.com', 'wrongpass')
  ).rejects.toThrow('Credenciales inválidas')
})
```

**Mocks:**
- `global.fetch` - Simula respuesta 401 (no autorizado)

**Texto para presentación:**
> "Este test valida la seguridad: si alguien intenta acceder con credenciales incorrectas, el sistema debe rechazarle. Mockeo fetch con status 401 y verifico que lance el error 'Credenciales inválidas'."

---

### Test 03: 03-auth-login-error-red.test.ts

**Qué hace:**
Valida que error de red lanza "Error de conexión".

**Texto para presentación:**
> "Este test valida el manejo de errores de red. Si el servidor no responde, el usuario debe ver 'Error de conexión', no un crash."

---

### Test 08: 08-auth-getToken-null.test.ts

**Qué hace:**
Valida que sin token, getToken() retorna null.

**Texto para presentación:**
> "Este test valida el caso negativo: si no hay token, getToken debe retornar null, no vacío ni undefined."

---

### Test 10: 10-auth-isAuthenticated-false.test.ts

**Qué hace:**
Valida que sin token, isAuthenticated() retorna false.

**Texto para presentación:**
> "Este test valida la regla de seguridad más básica: sin token, el usuario NO está autenticado."

---

### Test 11: 11-auth-isAuthenticated-expirado.test.ts ⭐

**TDD:** RED → GREEN - Test de validación CRÍTICO

**Qué hace:**
Valida que token expirado (fecha pasada) retorna false. Es como "saldo negativo" en seguridad.

**Código:**
```typescript
it('debe retornar false cuando el token está expirado', async () => {
  const expiredDate = Date.now() - 1000
  localStorage.setItem('auth_token', 'expired-token')
  localStorage.setItem('auth_token_expiry', expiredDate.toString())
  const { authService } = await import('../../services/authService')
  expect(authService.isAuthenticated()).toBe(false)
})
```

**Mocks:**
- Ninguno - usa localStorage real

**Texto para presentación:**
> "Este test valida la regla de negocio más importante: token expirado NO permite acceso. Es como el 'saldo negativo' en seguridad bancaria. Creo un token con fecha pasada y verifico que isAuthenticated retorne false."

---

### Test 13: 13-auth-register-error.test.ts

**Qué hace:**
Valida que error 400 en registro se maneja.

---

### Test 14: 14-auth-register-error-red.test.ts

**Qué hace:**
Valida que error de red en registro lanza "Error de conexión".

---

# PARTE 3: USE AUTH (Tests 16-24)

## 3.1 Tests que Verifican (GREEN)

### Test 16: 16-useAuth-inicial.test.ts

**Qué hace:**
Verifica que el hook useAuth inicia con isAuthenticated=false, token=null, isLoading=false.

**Mocks:**
- `react-router-dom` - Mock de useNavigate

**Texto para presentación:**
> "Este test verifica el estado inicial del hook useAuth: cuando no hay token, debe iniciar con isAuthenticated=false, token=null, y isLoading=false."

---

### Test 17: 17-useAuth-inicial-token.test.ts

**Qué hace:**
Verifica que el hook detecta token existente al iniciar y restaura sesión.

---

### Test 18: 18-useAuth-login.test.ts ⭐

**Qué hace:**
Verifica que el hook hace login y actualiza el estado: isAuthenticated=true, token, error=null.

**Mocks:**
- `global.fetch` - Simula servidor
- `react-router-dom` - Mock de useNavigate

**Código:**
```typescript
it('debe hacer login exitosamente y crear sesión', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ token: 'jwt-token-abc123' })
  })
  const { result } = renderHook(() => useAuth())
  await act(async () => {
    await result.current.login('test@restaurant.com', 'password123')
  })
  expect(result.current.isAuthenticated).toBe(true)
  expect(result.current.token).toBe('jwt-token-abc123')
  expect(result.current.error).toBeNull()
})
```

**Texto para presentación:**
> "Este test verifica el flujo completo de login en el hook. Uso dos mocks: fetch para simular el servidor, y react-router-dom para evitar navegación real. Así aíslo solo la lógica del hook."

---

### Test 20: 20-useAuth-login-loading.test.ts

**Qué hace:**
Verifica que el estado isLoading cambia durante login.

---

### Test 21: 21-useAuth-logout.test.ts

**Qué hace:**
Verifica que logout limpia estado interno y localStorage.

---

### Test 22: 22-useAuth-register.test.ts

**Qué hace:**
Verifica que el hook puede hacer registro.

---

### Test 24: 24-useAuth-register-loading.test.ts

**Qué hace:**
Verifica estado loading durante registro.

---

## 3.2 Tests que Validan (RED → GREEN)

### Test 19: 19-useAuth-login-error.test.ts ⭐

**TDD:** RED → GREEN - Test de validación CRÍTICO

**Qué hace:**
Valida que error de login NO crea sesión: isAuthenticated=false, error="Credenciales inválidas", token=null, NO guarda en localStorage.

**Mocks:**
- `global.fetch` - Simula 401
- `react-router-dom` - Mock de useNavigate

**Texto para presentación:**
> "Este test valida la seguridad en el hook: si el login falla, el hook debe manejar el error, NO crear sesión, y mostrar el mensaje correcto. Es la validación más importante para el hook."

---

### Test 23: 23-useAuth-register-error.test.ts

**Qué hace:**
Valida que error de red en registro se maneja correctamente.

---

# PARTE 4: LOGIN VIEW (Tests 25-41)

## 4.1 Tests que Verifican (GREEN) - UI/Formulario

### Test 25: 25-LoginView-formulario.test.tsx

**Qué hace:**
Verifica que el formulario renderiza y existe el botón "Iniciar sesión".

**Mocks:**
- `useAuth` - Mock con valores por defecto

**Texto para presentación:**
> "Este test verifica que el componente se renderiza correctamente y muestra el botón de login."

---

### Test 26: 26-LoginView-titulo.test.tsx

**Qué hace:**
Verifica que el título "FoodTech Login" aparece.

---

### Test 27: 27-LoginView-enlace.test.tsx

**Qué hace:**
Verifica que existe el botón para cambiar a modo registro.

---

### Test 28: 28-LoginView-modo-registro.test.tsx

**Qué hace:**
Verifica que al hacer click en "Regístrate", cambia a modo registro con título "FoodTech Registro".

---

### Test 29: 29-LoginView-volver-login.test.tsx

**Qué hace:**
Verifica que desde modo registro se puede volver a modo login.

---

### Test 30: 30-LoginView-limpiar-campos.test.tsx

**Qué hace:**
Verifica que al cambiar de modo, los campos se limpian.

**Texto para presentación:**
> "Este test verifica que cuando el usuario cambia de modo (login a registro), los campos se limpian por seguridad y para evitar datos mezclados."

---

### Test 31: 31-LoginView-email.test.tsx

**Qué hace:**
Verifica que el campo email acepta texto.

---

### Test 32: 32-LoginView-password.test.tsx

**Qué hace:**
Verifica que el campo password acepta texto.

---

### Test 33: 33-LoginView-username.test.tsx

**Qué hace:**
Verifica que en modo registro aparece el campo username.

---

### Test 34: 34-LoginView-submit-login.test.tsx

**Qué hace:**
Verifica que al hacer submit en login, se llama a login del hook con email, password, rememberMe.

**Mocks:**
- `useAuth` - Mock con login controlable

**Texto para presentación:**
> "Este test verifica el flujo principal: el usuario completa el formulario y hace submit. Verifico que se llame al hook con los parámetros correctos."

---

### Test 35: 35-LoginView-rememberme.test.tsx

**Qué hace:**
Verifica que cuando el checkbox rememberMe está marcado, se pasa true al hook.

---

### Test 36: 36-LoginView-submit-register.test.tsx

**Qué hace:**
Verifica que en modo registro, el submit llama a register con email, username, password.

---

### Test 38: 38-LoginView-boton.test.tsx

**Qué hace:**
Verifica que el botón muestra "Iniciar sesión" cuando no está cargando.

---

### Test 39: 39-LoginView-registrarse.test.tsx

**Qué hace:**
Verifica que en modo registro el botón dice "Registrarse".

---

## 4.2 Tests que Validan (RED → GREEN) - Negocio

### Test 37: 37-LoginView-demo.test.tsx

**TDD:** RED → GREEN

**Qué hace:**
Valida que el modo demo (entrar sin cuenta) funciona correctamente guardando un token especial.

**Texto para presentación:**
> "Este test valida el modo demo: permite entrada rápida sin autenticación real."

---

### Test 40: 40-LoginView-error.test.tsx

**TDD:** RED → GREEN

**Qué hace:**
Valida que cuando hay error del hook, se muestra en pantalla.

**Mocks:**
- `useAuth` - Mock con error

**Texto para presentación:**
> "Este test valida que el usuario ve el mensaje de error cuando la autenticación falla."

---

### Test 41: 41-LoginView-loading.test.tsx

**TDD:** RED → GREEN

**Qué hace:**
Valida que cuando está cargando, muestra "Iniciando sesión..." en lugar del botón.

**Mocks:**
- `useAuth` - Mock con isLoading=true

**Texto para presentación:**
> "Este test valida el feedback de carga: mientras el servidor responde, el usuario ve 'Iniciando sesión...'."

---

# PARTE 5: TESTS ESPECIALES (43-48)

## Test 43: 43-authService-coverage.test.ts

**TDD:** GREEN

**Qué hace:**
Tests adicionales para aumentar cobertura: error 500, errores desconocidos.

---

## Test 44: 44-validacion-negocio.test.ts

**TDD:** RED → GREEN

**Qué hace:**
Agrupación de validaciones de negocio: token expirado, logout limpia, error no guarda token, etc.

---

## Test 45: 45-verificar-arquitectura.test.ts ⭐

**TDD:** GREEN

**Qué hace:**
Verifica que login llama al endpoint '/api/auth/login' con método POST.

**Código:**
```typescript
it('VERIFICAR: Login hace fetch al endpoint correcto', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ token: 'mock-token' })
  })
  global.fetch = mockFetch
  const { authService } = await import('../../services/authService')
  await authService.login('test@restaurant.com', 'password123')
  expect(mockFetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/auth/login'),
    expect.objectContaining({ method: 'POST' })
  )
})
```

**Texto para presentación:**
> "Este test verifica la ARQUITECTURA: que el código llama al endpoint correcto. Es verificación técnica, no de negocio."

---

## Test 46: 46-validar-negocio.test.ts ⭐⭐

**TDD:** RED → GREEN - TEST PRINCIPAL PARA EVALUACIÓN

**Qué hace:**
Valida tres reglas de negocio críticas:
1. Token expirado NO permite acceso (como "saldo negativo")
2. Credenciales inválidas NO crean sesión
3. Sin token = sesión inválida (como cuenta bloqueada)

**Código:**
```typescript
it('VALIDAR: Token expirado NO permite acceso - como "saldo negativo" en seguridad', async () => {
  const expiredDate = Date.now() - 1000
  localStorage.setItem('auth_token', 'expired-token')
  localStorage.setItem('auth_token_expiry', expiredDate.toString())
  const { authService } = await import('../../services/authService')
  expect(authService.isAuthenticated()).toBe(false)
})
```

**Texto para presentación:**
> "Este test valida el NEGOCIO: son las reglas que protegen la seguridad. Como 'saldo negativo' en banking, aquí 'token expirado' o 'credenciales wrong' no permiten acceso."

---

## Test 47: 47-edge-cases.test.ts

**TDD:** RED → GREEN

**Qué hace:**
Casos extremos: email vacío, password vacío, múltiples logout, login dos veces.

---

## Test 48: 48-integracion.test.ts

**TDD:** GREEN

**Qué hace:**
Tests de integración: login+logout completos, error de red, registro, loading state.

---

# PARTE 6: HUMAN CHECK

## 6.1 Ejemplo 1: Test 18 (useAuth login)

**Pregunta:** "¿Qué mockeas?"

```typescript
// Mock 1: global.fetch
global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ token: 'jwt-token-abc123' }) })
// ¿Por qué? Simula respuestas del servidor HTTP sin llamar API real

// Mock 2: react-router-dom
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
// ¿Por qué? Evita navegación real, aísla solo la lógica del hook
```

---

## 6.2 Ejemplo 2: Test 11 (Token Expirado)

**Pregunta:** "¿Por qué sin mocks?"

```typescript
// SIN MOCKS EXTERNOS
// Usa localStorage real del navegador
localStorage.setItem('auth_token', 'expired-token')
localStorage.setItem('auth_token_expiry', expiredDate.toString())
// ¿Por qué? El expiry es lógica de negocio pura, no depende de servicios externos
```

---

## 6.3 Ejemplo 3: Test 46 (Validar Negocio)

**Pregunta:** "¿Qué valida este test?"

> "Valida la regla de negocio más importante: token expirado NO permite acceso. Es como 'saldo negativo' en seguridad bancaria - si está expirado, no es válido."

---

# PARTE 7: RESUMEN

## Tests por Tipo

| Tipo | Cantidad | Descripción |
|------|----------|-------------|
| **Verifica (GREEN)** | 30+ | El código funciona correctamente |
| **Valida (RED→GREEN)** | 17+ | Las reglas de negocio se protegen |

## Coverage

- **authService:** 97.36% statements, 88.88% branches

---

# PARTE 9: HISTORIAS DE USUARIO

## 9.1 HU Completadas

| HU | Feature | Estado | Componente | Service | Hook | Tests |
|----|---------|--------|------------|---------|------|-------|
| HU-FRONT-001 | Login | ✅ Completado | `LoginView.tsx` | `authService.ts` | `useAuth.ts` | 48 tests |
| HU-FRONT-002 | Registro de Usuario | ✅ Completado | `LoginView.tsx` | `authService.ts` | `useAuth.ts` | 15 tests |

## 9.2 Detalle: Login (HU-FRONT-001)

**Estado:** ✅ Completado

**Componentes:**
- `src/views/LoginView.tsx` - Interfaz de login
- `src/services/authService.ts` - Lógica de autenticación
- `src/hooks/useAuth.ts` - Hook de React para autenticación

**Funcionalidades implementadas:**
- ✅ Login con email/password
- ✅ Login con remember me
- ✅ Logout
- ✅ Protección de rutas
- ✅ Manejo de errores
- ✅ Estado de carga (loading)
- ✅ Modo demo

## 9.3 Detalle: Registro de Usuario (HU-FRONT-002)

**Estado:** ✅ Completado

**Commits TDD Realizados:**

| # | Commit | Tipo TDD | Descripción |
|---|--------|----------|-------------|
| 1 | `test: add register tests` | RED | Tests de authService.register |
| 2 | `feat: implement register` | GREEN | Implementación de authService.register |
| 3 | `test: add register tests to useAuth` | RED | Tests de useAuth.register |
| 4 | `feat: add register to useAuth` | GREEN | Implementación de useAuth.register |
| 5 | `feat: add register toggle to UI` | GREEN | Toggle login/register en UI |

**Funcionalidades implementadas:**
- ✅ Registro con email, username, password
- ✅ Cambio entre modo login/registro
- ✅ Validación de campos
- ✅ Manejo de errores (username duplicado, error de red)

## 9.4 HU Pendientes (Sin iniciar)

| HU | Feature | Estado | Tests |
|----|---------|--------|-------|
| HU-FRONT-003 | Login con remember me | ⏳ Pendiente | 0 |
| HU-FRONT-004 | Reset password | ⏳ Pendiente | 0 |
| HU-FRONT-005 | Logout automático por inactividad | ⏳ Pendiente | 0 |

---

# PARTE 10: COMANDOS

```bash
npm test -- --run        # Ejecutar tests
npm test -- --coverage   # Tests con coverage
npm run lint             # Verificar código
npm run build            # Compilar
```

---

# PARTE 9: ORDEN PARA PRESENTACIÓN

1. **TESTING_STRATEGY.md** - "Tenemos una estrategia clara"
2. **Test 45** - "Verificar arquitectura: endpoint correcto"
3. **Test 46** - "Validar negocio: token expirado = sin acceso"
4. **Test 18** - "Ejemplo de mocks: fetch + router"
5. **Test 19** - "Validación: error no crea sesión"
6. **Correr tests:** `npm test -- --coverage`
7. **Mostrar coverage:** authService 97.36%
8. **Pipeline CI:** GitHub Actions configurado
