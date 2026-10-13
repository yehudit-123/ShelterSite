// require("dotenv").config();
 async function GetItems(url) {
    const res = await fetch(`http://localhost:3001/${url}`);
    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch {
            throw new Error(`Server error: ${res.status}`);
        }
        throw new Error(errorData.message || "Request failed");
    }
    const data = await res.json();

    return data;
}

async function PutItems(url, body) {

    const res = await fetch(`http://localhost:3001/${url}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

async function PostItems(url, body) {
    const res = await fetch(`http://localhost:3001/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log(data);
    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

async function DeleteItems(url) {
    const res = await fetch(`http://localhost:3001/${url}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("something went wrong, please try again");
    }
    let data;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    return data;
}

export { DeleteItems, PutItems, PostItems ,GetItems}