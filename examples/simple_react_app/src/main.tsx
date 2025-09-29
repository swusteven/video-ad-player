import { Video, VastParser, VideoOptions, VastInformation } from '@criteo/video-player';
import '@criteo/video-player/dist/style.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const VAST_URL =
  "https://rm-v.fr3.eu.criteo.com/v?rm_e=bbChWFJp7z18B62k38iLxTBV-7xn_7lnpX5AJNtGoXQ1YbhM31Jy4cpvRm5h4RgD0QfRxdvV92LalwuRppv9tj19rXYIwNjUjydOiiurzwZDib_wK7tIeW6tSGhJyMPb8MUWrz-m0tYUqX6yOmYK1jMuw0QBVSvSfWOS6p-KQXUzPYMUr6iL9-mLTVaISjMNqP5MGm8luy5_FXR_RpiLBSVwNUECS3-1SMDZWRhmhHeASmnktJBaYyIoZ6TQdEniwgFwGtMbPSGM_Irk-umRxLLZyuzOuB4EKl50TcZRqCQsctzZOg4_Wuexu-LGcfUv2HxpCJGezJnBA7NO8YGliuYNamHfnYmq8epFYOK6mVLdn1XcrHeRHr7OJsrxcY0peQWbJowFhOOWwhHm_cBPMzSeYWC9_LoJmbscfMvk9xk5gTDbBJLbHb6OGP_751Ep4m791JOzg7YhKXioS2z2guujLFo_xcBoHbKgeUWNySuCgeyg-O_xQImkpvgW1TTv6GmvI7qFich_gzzPf6CePYLVs8SepsaPJ7I_hzN4GSYmF78zeZ9RYZnldwPav1FXDxxz3aqArEJf1GQOLYq0YJIGRJ6a7VEEWcSXaLZYwDqJ6JDfsZ97wFEI-nt-LQv3mDOGc1JQxNJ1krTp7VO7FSpn07MakGvGJtlb5VO68sTnYr5nZaXSMT0g6Ur7YJQjSMhYKRaMKAvLcdOEHZQ-epKu2ai0DybRSTEbVhjtdHHhul0OIdAgYkfnCB8gdCYF7AA5sFskpU2jyuxPngsTNAA3EtYF0jCBrLAHWJq3yjYu0FfQOr-DXKuojMGrnp617G-QLxdGi2YxksAvyFlw8Myghd4ohaoDOCXgPO4c6flC_Ws0RWzHJ6hS8LfEDhMR&ev=4";

const options: VideoOptions = { altText: "Sample Criteo Video Ad" };

function App() {
  const [vastInformation, setVastInformation] = useState<VastInformation | null>(null);

  useEffect(() => {
    const fetchVastInformation = async () => {
      const vastParser = new VastParser();
      const information = await vastParser.getFromUrl(VAST_URL);
      setVastInformation(information);
    };
    fetchVastInformation();
  }, []);

  return (
    <>
      <h1>CriteoVideo Preact Demo</h1>
      {vastInformation ? (
      <Video vastInformation={vastInformation} options={options} />
      ) : null}
    </>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
