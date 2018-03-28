Select
    uv.userEmail userEmail,
    uv.userNonce userNonce,
    uv.nonceExpiration nonceExpiration
From AppUsersVerification uv
Where uv.userEmail = :email and uv.nonceExpiration > :moment