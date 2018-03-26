select
    u.userEmail userName,
    u.userEmail email,
    u.userAvatar avatar,
    u.userDisplayName displayName,
    u.userDigest digest,
    r.userGroup role
from appUsers u inner join appUsersGroups r