<?php

return [
    'Reservation' => [
        'Status' => [
            'Reserved' => 1,
            'Canceled' => 2,
            'CheckeIn' => 3,
        ],
        'StatusName' => [
            1 => '予約済み',
            2 => 'キャンセル済み',
            3 => '宿泊済み',
        ],
    ],
    'Notice' => [
        'Status' => [
            'Draft' => 1,
            'Published' => 2,
            'Archived' => 3,
        ],
        'StatusName' => [
            1 => '下書き',
            2 => '公開中',
            3 => '非公開',
        ],
    ],
    'Fair' => [
        'Status' => [
            'Draft' => 1,
            'Published' => 2,
            'Archived' => 3,
        ],
        'StatusName' => [
            1 => '下書き',
            2 => '公開中',
            3 => '非公開',
        ],
    ],
    'ReservationAvailability' => [
        'Status' => [
            'Available' => 1,
            'Limited' => 2,
            'Full' => 3,
        ],
        'StatusName' => [
            1 => '空室あり',
            2 => '残りわずか',
            3 => '満室',
        ],
    ],
    'Contact' => [
        'Type' => [
            'user' => 1,
            'admin' => 2
        ],
        'TypeName' => [
            1 => 'ユーザー',
            2 => '管理者',
        ],
        'IsRepley' => [
            'False' => 0,
            'True' => 1,
        ],
        'IsRepleyName' => [
            0 => '',
            1 => '済'
        ]
    ],
    'Room' => [
        'Status' => [
            'Published' => 1,
            'Archived' => 2,
        ],
        'StatusName' => [
            1 => '公開中',
            2 => '非公開',
        ],
    ],
    'Plan' => [
        'Status' => [
            'Draft' => 1,
            'Published' => 2,
            'Archived' => 3,
        ],
        'StatusName' => [
            1 => '下書き',
            2 => '公開中',
            3 => '非公開',
        ],
    ],
    'Restaurant' => [
        'Times' => [
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00'
        ],
    ],
    
];