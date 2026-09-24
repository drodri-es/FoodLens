# Historial de escaneos reales

**Estado:** implementado  
**Última revisión:** 25 de septiembre de 2026

FoodLens conserva localmente los últimos 50 productos obtenidos de Open Food
Facts. Cada escaneo se registra con una fecha ISO y un nuevo escaneo del mismo
código actualiza su posición y fecha, en lugar de crear duplicados.

## Funciones disponibles

- agrupación cronológica en Hoy, Ayer, Esta semana y Anteriores;
- búsqueda sin distinción de mayúsculas o acentos por nombre, marca o código;
- reapertura de la ficha real del producto;
- inicio de una comparación real desde cualquier elemento;
- eliminación individual y vaciado completo del historial;
- presentación de una fecha legible calculada a partir de la fecha ISO guardada.

Los escaneos usados como segundo producto de una comparación también se añaden
al historial. Los valores antiguos como `Ahora mismo` o `Hoy` se migran usando
la fecha de consulta a Open Food Facts (`source.fetchedAt`). Si tampoco existe
una fecha válida, se utiliza el inicio de la época Unix para que el elemento
quede clasificado como anterior sin inventar cuándo se escaneó.

## Privacidad y límites

El historial se guarda en `localStorage` dentro de `foodlens:app-state`. No se
sincroniza entre dispositivos ni se envía a un backend propio. Borrar los datos
del navegador elimina este historial.
