export const requestNotification = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('permission granted')
  } else {
    console.log('permission denied')
  }
}

export const showNotification = async (title, body, icon) => {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  registration.active.postMessage({
    type: 'SHOW_NOTIFICATION',
    title,
    body,
    icon,
  });
}