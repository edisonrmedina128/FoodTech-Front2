Appendix: Estructura del Reporte

Este apéndice detalla cómo está estructurado el informe de pruebas para que el evaluador pueda ver claramente la trazabilidad y la cobertura multinivel.

Secciones propuestas (para incluir en TEST_PLAN.md o enlazar desde él):
- Estructura del informe
  - Sección 1: Resumen ejecutivo
  - Sección 2: Alcance y entregables
  - Sección 3: Estrategia multinivel (Componentes, Integración, E2E) y tipos de pruebas
  - Sección 4: 7 principios del testing con ejemplos aplicados
  - Sección 5: Test Suites y Test Cases (mapa HU → tests)
  - Sección 6: Evidencia del pipeline (lint, tests, build, seguridad, logs de ejecución)
  - Sección 7: GitFlow y Release (ramas, PR, tag)
  - Sección 8: HITL (validación humana) y criterios de auditoría
  - Sección 9: Organización del repositorio (Dockerfile, plan, pipeline, tests)
- Anexo: Mapeo HU → Tests (ejemplo)
  - HU-010 Login → tests/e2e/login.spec.ts
  - HU-011 Logout → tests/e2e/logout.spec.ts
  - HU-012 Registro → tests/e2e/register.spec.ts
- Notas de implementación
  - Este apéndice es de apoyo para la defensa y la revisión de la rúbrica. Los cambios en el código deben entregarse como patches para revisión y aprobación.
