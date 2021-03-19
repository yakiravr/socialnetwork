export default function reducer(state = {}, action) {
    // series of IF statements....
    if (action.type === "UPDATE_STATE_SOMEHOW") {
        // update state somehow...
    }
    // last thing we want to do is return the new state...
    return state;
}

// it's really important to not MUTATE state....

// useful array methods (ones that dont mutate)
// filter and map

//# filter - it's great if we want to get rid of something from an array...

//# map - always returns a new array of the same length

// cloning objects....

// var person = { name: "pete"}

// var otherPerson = {
//     ...person,
// };

// cloning arrays....
// var arr = [1212,3242,222];
// var newArr = [...arr];
