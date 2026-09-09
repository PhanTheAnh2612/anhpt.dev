import type { SceneManifestEntry } from '../../scripts/assets/generate-scenes'

export type { SceneManifestEntry } from '../../scripts/assets/generate-scenes'

export const sceneManifest = {
  'course-route': {
    desktop: {
      src: '/assets/scenes/course-route.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/course-route.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 17,
        yPercent: 11,
        widthPercent: 79,
        heightPercent: 83,
      },
      mobile: {
        xPercent: 4,
        yPercent: 7,
        widthPercent: 92,
        heightPercent: 87,
      },
    },
    safeZones: {
      clearing: {
        desktop: {
          xPercent: 61,
          yPercent: 57,
          widthPercent: 34,
          heightPercent: 20,
        },
        mobile: {
          xPercent: 58,
          yPercent: 58,
          widthPercent: 38,
          heightPercent: 20,
        },
      },
    },
    anchors: {
      character: {
        desktop: {
          xPercent: 39,
          yPercent: 78,
          scale: 2,
        },
        mobile: {
          xPercent: 32,
          yPercent: 79,
          scale: 2,
        },
      },
    },
  },
  ezbuilder: {
    desktop: {
      src: '/assets/scenes/ezbuilder.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/ezbuilder.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 31,
        yPercent: 11,
        widthPercent: 66,
        heightPercent: 81,
      },
      mobile: {
        xPercent: 4,
        yPercent: 5,
        widthPercent: 92,
        heightPercent: 88,
      },
    },
    safeZones: {
      'dark-wall': {
        desktop: {
          xPercent: 2,
          yPercent: 7,
          widthPercent: 28,
          heightPercent: 62,
        },
        mobile: {
          xPercent: 4,
          yPercent: 68,
          widthPercent: 92,
          heightPercent: 28,
        },
      },
    },
    anchors: {
      detail: {
        desktop: {
          xPercent: 74,
          yPercent: 72,
          scale: 1,
        },
        mobile: {
          xPercent: 70,
          yPercent: 70,
          scale: 1,
        },
      },
    },
  },
  'guild-hall': {
    desktop: {
      src: '/assets/scenes/guild-hall.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/guild-hall.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 6,
        yPercent: 4,
        widthPercent: 88,
        heightPercent: 90,
      },
      mobile: {
        xPercent: 4,
        yPercent: 3,
        widthPercent: 92,
        heightPercent: 93,
      },
    },
    safeZones: {
      'central-floor': {
        desktop: {
          xPercent: 40,
          yPercent: 55,
          widthPercent: 43,
          heightPercent: 21,
        },
        mobile: {
          xPercent: 21,
          yPercent: 56,
          widthPercent: 58,
          heightPercent: 20,
        },
      },
    },
    anchors: {
      character: {
        desktop: {
          xPercent: 69,
          yPercent: 73,
          scale: 1,
        },
        mobile: {
          xPercent: 86,
          yPercent: 79,
          scale: 1,
        },
      },
      role: {
        desktop: {
          xPercent: 47,
          yPercent: 48,
          scale: 1,
        },
        mobile: {
          xPercent: 44,
          yPercent: 47,
          scale: 1,
        },
      },
      impact: {
        desktop: {
          xPercent: 34,
          yPercent: 72,
          scale: 1,
        },
        mobile: {
          xPercent: 31,
          yPercent: 76,
          scale: 1,
        },
      },
      team: {
        desktop: {
          xPercent: 38,
          yPercent: 56,
          scale: 1,
        },
        mobile: {
          xPercent: 34,
          yPercent: 58,
          scale: 1,
        },
      },
      achievement: {
        desktop: {
          xPercent: 82,
          yPercent: 43,
          scale: 1,
        },
        mobile: {
          xPercent: 70,
          yPercent: 43,
          scale: 1,
        },
      },
      values: {
        desktop: {
          xPercent: 82,
          yPercent: 24,
          scale: 1,
        },
        mobile: {
          xPercent: 13,
          yPercent: 23,
          scale: 1,
        },
      },
      confidentiality: {
        desktop: {
          xPercent: 92,
          yPercent: 54,
          scale: 1,
        },
        mobile: {
          xPercent: 68,
          yPercent: 34,
          scale: 1,
        },
      },
    },
  },
  home: {
    desktop: {
      src: '/assets/scenes/home.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/home.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 4,
        yPercent: 14,
        widthPercent: 35,
        heightPercent: 38,
      },
      mobile: {
        xPercent: 4,
        yPercent: 8,
        widthPercent: 39,
        heightPercent: 27,
      },
    },
    safeZones: {
      ocean: {
        desktop: {
          xPercent: 65,
          yPercent: 29,
          widthPercent: 29,
          heightPercent: 25,
        },
        mobile: {
          xPercent: 76,
          yPercent: 25,
          widthPercent: 21,
          heightPercent: 28,
        },
      },
      path: {
        desktop: {
          xPercent: 8,
          yPercent: 62,
          widthPercent: 28,
          heightPercent: 29,
        },
        mobile: {
          xPercent: 4,
          yPercent: 48,
          widthPercent: 33,
          heightPercent: 29,
        },
      },
    },
    anchors: {
      character: {
        desktop: {
          xPercent: 30,
          yPercent: 77,
          scale: 2.5,
        },
        mobile: {
          xPercent: 27,
          yPercent: 78,
          scale: 2,
        },
      },
    },
  },
  'not-found': {
    desktop: {
      src: '/assets/scenes/not-found.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/not-found.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 4,
        yPercent: 14,
        widthPercent: 35,
        heightPercent: 38,
      },
      mobile: {
        xPercent: 4,
        yPercent: 8,
        widthPercent: 39,
        heightPercent: 27,
      },
    },
    safeZones: {
      ocean: {
        desktop: {
          xPercent: 65,
          yPercent: 29,
          widthPercent: 29,
          heightPercent: 25,
        },
        mobile: {
          xPercent: 76,
          yPercent: 25,
          widthPercent: 21,
          heightPercent: 28,
        },
      },
    },
    anchors: {
      character: {
        desktop: {
          xPercent: 20,
          yPercent: 84,
          scale: 2.5,
        },
        mobile: {
          xPercent: 25,
          yPercent: 72,
          scale: 2,
        },
      },
    },
  },
  'secret-base': {
    desktop: {
      src: '/assets/scenes/secret-base.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/secret-base.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 43,
        yPercent: 24,
        widthPercent: 49,
        heightPercent: 65,
      },
      mobile: {
        xPercent: 3,
        yPercent: 21,
        widthPercent: 86,
        heightPercent: 67,
      },
    },
    safeZones: {
      'dark-wall': {
        desktop: {
          xPercent: 2,
          yPercent: 8,
          widthPercent: 27,
          heightPercent: 47,
        },
        mobile: {
          xPercent: 1,
          yPercent: 2,
          widthPercent: 25,
          heightPercent: 9,
        },
      },
    },
    anchors: {
      character: {
        desktop: {
          xPercent: 55,
          yPercent: 76,
          scale: 2,
        },
        mobile: {
          xPercent: 19,
          yPercent: 73,
          scale: 2,
        },
      },
    },
  },
  'topic-mastery': {
    desktop: {
      src: '/assets/scenes/topic-mastery.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/topic-mastery.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 5,
        yPercent: 6,
        widthPercent: 90,
        heightPercent: 87,
      },
      mobile: {
        xPercent: 5,
        yPercent: 5,
        widthPercent: 90,
        heightPercent: 90,
      },
    },
    safeZones: {
      'training-field': {
        desktop: {
          xPercent: 15,
          yPercent: 45,
          widthPercent: 47,
          heightPercent: 25,
        },
        mobile: {
          xPercent: 8,
          yPercent: 45,
          widthPercent: 50,
          heightPercent: 24,
        },
      },
    },
    anchors: {
      character: {
        desktop: {
          xPercent: 72,
          yPercent: 84,
          scale: 2,
        },
        mobile: {
          xPercent: 72,
          yPercent: 86,
          scale: 2,
        },
      },
    },
  },
  'world-map': {
    desktop: {
      src: '/assets/scenes/world-map.desktop.png',
      width: 1536,
      height: 1024,
    },
    mobile: {
      src: '/assets/scenes/world-map.mobile.png',
      width: 1024,
      height: 1280,
    },
    focalArea: {
      desktop: {
        xPercent: 5,
        yPercent: 5,
        widthPercent: 90,
        heightPercent: 90,
      },
      mobile: {
        xPercent: 5,
        yPercent: 26,
        widthPercent: 90,
        heightPercent: 47,
      },
    },
    safeZones: {
      ocean: {
        desktop: {
          xPercent: 4,
          yPercent: 4,
          widthPercent: 16,
          heightPercent: 12,
        },
        mobile: {
          xPercent: 0,
          yPercent: 0,
          widthPercent: 100,
          heightPercent: 22,
        },
      },
    },
    anchors: {
      character: {
        desktop: {
          xPercent: 50,
          yPercent: 85,
          scale: 1,
        },
        mobile: {
          xPercent: 50,
          yPercent: 68,
          scale: 1,
        },
      },
    },
  },
} as const satisfies Record<string, SceneManifestEntry>
