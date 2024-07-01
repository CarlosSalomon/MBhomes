import { logger } from "../../../config/logger_CUSTOM.js";

export const nullIdCartErrorInfo = (cid) => {
    logger.error(`
      El Id ingresado no corresponde a ningún carrito de la DB.
          Propiedad requerida:
  
              -> Id recibido: ${cid}.
      `);
};

export const IdCartErrorInfo = (cid) => {
    logger.error(`
      El Id ingresado no corresponde a ningún carrito de la DB.
          Propiedad requerida:
  
              -> Id recibido: ${cid}.
      `);
};

export const addCartErrorInfo = (cid) => {
    logger.error(`
      No se pudo agregar el producto al carrito.
          Propiedad requerida:
  
              -> No hay suficiente Stock.
      `);
};



