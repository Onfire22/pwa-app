export const startBackgroundFetch = async (...files) => {
  if (!navigator.backgroundFetch) {
      console.warn('Background Fetch API не поддерживается');
      return;
  }

  try {
      const registration = await navigator.backgroundFetch.fetch(
          'fetch-id',
          files, 
          {
              title: 'Загрузка видео',
              icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }],
              totalDownloadSize: 50 * 1024 * 1024,
          }
      );

      console.log(`Фоновая загрузка начата: ${registration.id}`);
  } catch (error) {
      console.error('Ошибка при запуске фоновой загрузки:', error);
  }
}
