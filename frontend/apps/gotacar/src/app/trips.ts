const location1 = {
  name: 'Sevilla',
  address: 'Calle Canal 48"',
  lat: 37.3747084,
  lng: -5.9649715,
};

const location2 = {
  name: 'Sevilla',
  address: 'Av. Diego Martínez Barrio',
  lat: 37.37625144174958,
  lng: -5.976345387146261,
};

const fecha1 = new Date(2021, 6, 4, 13, 30, 24);
const fecha2 = new Date(2021, 6, 4, 13, 36, 24);
const fecha3 = new Date(2001, 6, 4);

const user1 = {
  firstName: 'Manuel',
  lastName: 'Fernandez',
  uid: 'h9HmVQqlBQXD289O8t8q7aN2Gzg1',
  email: 'manan@gmail.com',
  dni: '312312312',
  profilePhoto: 'https://dasdasdas.com',
  birthdate: fecha3,
  roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
};

const user2 = {
  firstName: 'Manuel',
  lastName: 'Fernandez',
  uid: '1',
  email: 'manan@gmail.com',
  dni: '312312312',
  profilePhoto: 'https://dasdasdas.com',
  birthdate: fecha3,
  roles: ['ROLE_CLIENT', 'ROLE_DRIVER'],
};

export const trips = [
  {
    id: 1,
    startingPoint: location1,
    endingPoint: location2,
    price: 220,
    startDate: fecha1,
    endingDate: fecha2,
    comments: 'Cometario',
    places: 3,
    user: user1,
  },
  {
    id: 2,
    startingPoint: location1,
    endingPoint: location2,
    price: 220,
    startDate: fecha1,
    endingDate: fecha2,
    comments: 'Cometario',
    places: 3,
    user: user1,
  },
  {
    id: 3,
    startingPoint: location1,
    endingPoint: location2,
    price: 220,
    startDate: fecha1,
    endingDate: fecha2,
    comments: 'Cometario',
    places: 3,
    user: user2,
  },
];
