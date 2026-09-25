# Resumen de la ficha de producto

**Estado:** implementado  
**Última revisión:** 25 de septiembre de 2026

La ficha real incluye dos resúmenes automáticos: «Lo mejor» y «A tener en
cuenta». Su objetivo es facilitar una primera lectura de los datos conocidos,
no determinar si un producto es saludable o adecuado para una persona.

## Reglas de selección

«Lo mejor» puede mostrar, como máximo, tres datos:

- Nutri-Score A o B publicado por Open Food Facts;
- fibra igual o superior a 6 g por 100 g/ml;
- sal igual o inferior a 0,3 g por 100 g/ml;
- clasificación NOVA 1 o 2;
- ausencia de aditivos solo cuando el atributo de Open Food Facts es conocido y
  tiene valoración máxima. Una lista vacía por sí sola no se considera prueba.

«A tener en cuenta» puede mostrar, como máximo, tres datos:

- Nutri-Score D o E publicado por Open Food Facts;
- azúcares desde 15 g por 100 g/ml;
- grasas saturadas desde 5 g por 100 g/ml;
- sal desde 1,5 g por 100 g/ml;
- clasificación NOVA 4;
- número de aditivos declarados cuando la lista no está vacía.

Los textos muestran cantidades o clasificaciones, sin atribuir efectos sobre la
salud. Si faltan datos, la interfaz lo indica y no crea destacados. Las reglas
de selección están aisladas en una función de dominio y cubiertas por pruebas.
