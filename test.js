let x = {
    profile:{
        name: '123',
        age: 18,
    }
}
console.log(x && x.profile && x.profile.color)
console.log(x.profile?.color)
