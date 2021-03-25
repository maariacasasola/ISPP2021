const date1 = new Date(2021, 3, 20, 17, 45);

const location1 = {
    name: 'Sevilla',
    address: 'Calle Canal 48',
    lat: 37.3747084,
    lng: -5.9649715,
}

const location2 = {
    name: 'Sevilla',
    address: 'Av. Diego Martínez Barrio',
    lat: 37.37625144174958,
    lng: -5.976345387146261,
}

const fecha1 = new Date(2021, 6, 4, 13, 30, 24);
const fecha2 = new Date(2021, 6, 4, 13, 36, 24);
const fecha3 = new Date(2001, 6, 4);

const user1 = {
    firstName:'Manuel',
    lastName: 'Fernandez',
    uid: 'h9HmVQqlBQXD289O8t8q7aN2Gzg1',
    email: 'manan@gmail.com',
    dni: '312312312',
    profilePhoto: 'http://dasdasdas.com',
    birthdate: fecha3,
    roles: ['ROLE_CLIENT', 'ROLE_DRIVER'], 
}

const user2 = {
    firstName:'Manuel',
    lastName: 'Fernandez',
    uid: '1',
    email: 'manan@gmail.com',
    dni: '312312312',
    profilePhoto: 'http://dasdasdas.com',
    birthdate: fecha3,
    roles: ['ROLE_CLIENT', 'ROLE_DRIVER'], 
}

export const trips = [
    {
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
        startingPoint: location1,
        endingPoint: location2,
        price: 220,
        startDate: fecha1,
        endingDate: fecha2,
        comments: 'Cometario',
        places: 3,
        user: user2,
    },

]

export const complaints = [
    {
        id: 1,
        title: 'Queja por velocidad',
        content: 'El conductor iba demasiado rápido, no me he sentido seguro',
        user: user1,
        trip: trips[1],
        creationDate: date1,
        status: 'PENDING',
    },
    {
        id: 2,
        title: 'Queja por velocidad',
        content: 'El conductor iba demasiado rápido, no me he sentido seguro',
        user: user1,
        trip: trips[0],
        creationDate: date1,
        status: 'PENDING',
    },
    {
        id: 3,
        title: 'Queja por velocidad',
        content: 'El conductor iba demasiado rápido, no me he sentido seguro',
        user: user2,
        trip: trips[0],
        creationDate: date1,
        status: 'PENDING',
    },
    {
        id: 4,
        title: 'Queja por velocidad',
        content: 'El conductor iba demasiado rápido, no me he sentido seguro',
        user: user2,
        trip: trips[2],
        creationDate: date1,
        status: 'PENDING',
    },
]

