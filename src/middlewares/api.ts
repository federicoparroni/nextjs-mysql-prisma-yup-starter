import { Role } from "@prisma/client";
import { getAuthUser } from "../../utils/authentication"

export function authMiddleware(authorizedRoles?: Role[]) {
    return ((req, res, next) => {
        // Check if token exist
        if (!req.cookies['next-auth.session-token']) {
            return res.status(401).json({
                error: 'Please log in to access this resource',
            });
        }

        const session = getAuthUser(req);

        if (authorizedRoles.length === 0 || authorizedRoles.includes(session.role)) {
            req.session = session;
            return next();
        }

        return res.status(403).json({
            error: 'You have not the privileges to access this resource',
        });
    })
}
