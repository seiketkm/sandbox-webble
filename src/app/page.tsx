"use client"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <button onClick={async function () {
          const device = await navigator.bluetooth.requestDevice(
            {
              filters: [{ namePrefix: 'A&D' }]
            }
          )

          const server = await device.gatt.connect()
          //          const service = await server.getPrimaryService(0x1809) /* Health Thermometer */
          const service = await server.getPrimaryServices() /* Health Thermometer */
          const characteristic = await service.getCharacteristic(0x2a1c) /* Descriptor */
          const descriptor = await characteristic.getDescriptor(0x2902)
          const value = await descriptor.readValue()
          console.log("value: " + value) // get 0x0000

          // ここからあやしい
          await descriptor.writeValue(new Uint8Array([0x02, 0x00]))
          await characteristic.startNotifications();
          characteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = event.target.value;
            console.log('Received ' + value);
          });

          console.log('Notifications have been started.');

        }}>
          けいそく
        </button>
      </div>
    </main >
  )
}
