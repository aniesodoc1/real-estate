import apiRequest from "./apiRequest"



export const singlePageLoader = async ({request,params}) => {
    const res = await apiRequest("/posts/"+params.id)
    return res.data;
}

// export const listPageLoader = async ({ request }) => {
//     console.log(request)
//     const url = new URL(request.url);
//     const query = url.searchParams.toString(); 

//     console.log("Query Params:", query); // Debugging

//     const res = await apiRequest(`/posts?${query}`); // Append query params
//     return res.data;
// };

// export const listPageLoader = async ({ request }) => {
//    // console.log(request)
//     const query = request.url.split("?")[1]
//     const postResponse = await apiRequest("/posts?" + query);
//     console.log(postResponse)
//     return postResponse.data
   
// };
