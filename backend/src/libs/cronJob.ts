import cron from 'node-cron';
import { ModelUser, UserRole } from '../models/user.model';

export const setupCronJobs = () => {
  // Se ejecuta el 1° de cada mes a las 00:00
  cron.schedule('0 0 1 * *', async () => {
    console.log('🔄 Ejecutando verificación de expiración de pasantes...');

    try {
      const now = new Date();

      // 1. Ejecutamos la actualización directa en la Base de Datos
      // updateMany aplica los cambios en MongoDB de manera atómica
      const result = await ModelUser.updateMany(
        {
          role: UserRole.PASSANT,
          disabled: false,
          expiresAt: { $lte: now } // Menor o igual a la fecha actual
        },
        {
          $set: { disabled: true } // Cambia el estado a disabled: true en la DB
        }
      );

      // 2. result.modifiedCount nos dice cuántos documentos FUERON MODIFICADOS en la DB
      if (result.modifiedCount > 0) {
        console.log(`✅ Se actualizaron en DB y desactivaron ${result.modifiedCount} pasantes expirados.`);
      } else {
        console.log('ℹ️ No se encontraron pasantes expirados para desactivar.');
      }

    } catch (error: any) {
      console.error('❌ Error en Cron Job de expiración:', error.message);
    }
  });
};