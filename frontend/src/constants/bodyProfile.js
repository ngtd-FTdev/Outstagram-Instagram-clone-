import PostsProfile from '@/pages/ProfileUser/BodyProfile/PostsProfile'
import SavedProfile from '@/pages/ProfileUser/BodyProfile/SavedProfile'
import TaggedProfile from '@/pages/ProfileUser/BodyProfile/TaggedProfile'

export const BODYPROFILE = {
    '/': PostsProfile,
    saved: SavedProfile,
    tagged: TaggedProfile,
}
