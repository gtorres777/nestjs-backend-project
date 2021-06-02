import { CreateUserDto } from "src/user/dtos/user.dto"
import { CreateProfileUserDto } from "src/userProfile/dtos/user-profile.dto"
import { SuscriptionState } from "src/userProfile/interface/user-profile.interface"
import { CreateVideoDto } from "src/videos/dtos/videos.dto"
import { CreateWalletDto } from "src/wallet/dtos/wallet.dto"
import { CreateTalesDto } from "src/tales/dto/tales.dto"
import { CreateOutfitDto } from "src/outfit/dtos/outfit.dto"
import { ListOfSet } from "src/avatar/interface/avatar.interface"
import { CreateAvatarDto } from "src/avatar/dtos/avatar.dto"
import { UpdateAvatarDto } from "src/avatar/dtos/update-avatar.dto"


export const idUser = "608850dc5b2dc201faacdbcd"

export const idUser_to_fail = "60885d4ec777e302b066c20b"

export const outfitId_to_fail = "607e2f02807a43002cb5a33c"

export const new_user: CreateUserDto = {
    name:"tux1",
    email:"tux1@gmail.com",
    password:"aeamano"
}

export const new_user2: CreateUserDto = {
    name:"tux2",
    email:"tux2@gmail.com",
    password:"aeamano"
}

export const new_avatar: CreateAvatarDto = {
    _user: idUser,
    avatar_sets: [ListOfSet.DEFAULT],
    current_style: ListOfSet.DEFAULT,
}

export const new_avatar_for_update: UpdateAvatarDto = {
    current_style: ListOfSet.DEFAULT,
}

export const new_outfit: CreateOutfitDto = {
    outfit_image: 'http://zorro-cowboy',
    outfit_name: ListOfSet.COWBOY,
    price: -1,
}

export const new_outfit2: CreateOutfitDto = {
    outfit_image: 'http://zorro-astronaut',
    outfit_name: ListOfSet.ASTRONAUT,
    price: 3,
}

export const new_outfit3: CreateOutfitDto = {
    outfit_image: 'http://zorro-cowboy',
    outfit_name: ListOfSet.COWBOY,
    price: 45,
}

export const profileUser: CreateProfileUserDto = {
    _user: idUser,
    favorite_tales: [],
    tales_completed: [],
    name: 'tux',
    profile_image:'userdefault',
    suscription_state: SuscriptionState.INACTIVE
}

export const new_video: CreateVideoDto = {
    title:"video1",
    path:"http://urlvideo1",
    img:"coverpage1"
}

export const new_video2: CreateVideoDto = {
    title:"video2",
    path:"http://urlvideo2",
    img:"coverpage2"
}

export const new_video3: CreateVideoDto = {
    title:"video3",
    path:"http://urlvideo3",
    img:"coverpage3"
}

export const new_wallet: CreateWalletDto = {
    _user: idUser,
    total_coins:50
}

export const new_tale: CreateTalesDto = {
    title: 'afrodita y la gata',
    cover_page: 'https://cover',
    content: ['content'],
    difficulty: 'facil',
    gender: 'drama',
    author: 'chabelos',
    questions:[
        {
            question_id: 1,
            question: "¿Quién se había enamorado?",
            alternative: [
                {
                    "label": "Afrodita",
                    "value": 0
                },
                {
                    "label": "Una gata",
                    "value": 1
                },
                {
                    "label": "Un hermoso joven",
                    "value": 2
                },
                {
                    "label": "Un ratón",
                    "value": 3
                }
            ],
            correct_answer: 1
        }
    ]
}

export const new_tale2: CreateTalesDto = {
    title: 'afrodita y la gata3',
    cover_page: 'https://cover3',
    content: ['content'],
    difficulty: 'facil',
    gender: 'drama',
    author: 'chabelos',
    questions:[
        {
            question_id: 1,
            question: "¿Quién se había enamorado?",
            alternative: [
                {
                    "label": "Afrodita",
                    "value": 0
                },
                {
                    "label": "Una gata",
                    "value": 1
                },
                {
                    "label": "Un hermoso joven",
                    "value": 2
                },
                {
                    "label": "Un ratón",
                    "value": 3
                }
            ],
            correct_answer: 1
        }
    ]
}

export const new_tale_for_update: CreateTalesDto = {
    title: 'afrodita y la gata2',
    cover_page: 'https://cover2',
    content: ['content2'],
    difficulty: 'facil2',
    gender: 'drama2',
    author: 'chabelos2',
    questions:[
        {
            question_id: 1,
            question: "¿Quién se había enamorado2?",
            alternative: [
                {
                    "label": "Afrodita2",
                    "value": 0
                },
                {
                    "label": "Una gata2",
                    "value": 1
                },
                {
                    "label": "Un hermoso joven2",
                    "value": 2
                },
                {
                    "label": "Un ratón2",
                    "value": 3
                }
            ],
            correct_answer: 2
        }
    ]
}
