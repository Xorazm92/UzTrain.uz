interface weather {
    name: string;
  main: {
    temp: string;
    humidity: string;
    feels_like: string;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: string;
    deg: string;
  };
}

export default weather;