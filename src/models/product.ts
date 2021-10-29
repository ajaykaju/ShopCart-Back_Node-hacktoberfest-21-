import { truncateSync } from "fs";
import mongoose, { Document, Schema } from "mongoose";

export interface ProductDocument extends Document {
  title: string;
  parent: string;
  categories: string[];
  rating: string;
  images: string[];
  currentPrice: number;
  actualPrice: number;
  briefDescription: string;
  availableOffers: [
    {
      title: string;
      offer: string;
    }
  ];
  warranty: string;
  sellerAndPolicies: {
    name: string;
    policies: string[];
  };
  highlights: string[];
  descriptions: [
    {
      title: string;
      description: string;
    }
  ];
  specifications: [
    {
      name: string;
      specification: [
        {
          title: string;
          content: string;
        }
      ];
    }
  ];
  manufactureAndOtherInfo: [
    {
      title: string;
      content: string;
    }
  ];
}

const productSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    parent: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    categories: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      validate: (v: any) => Array.isArray(v) && v.length > 0,
    },
    rating: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    images: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      validate: (v: any) => Array.isArray(v) && v.length > 0,
    },
    currentPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    actualPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    briefDescription: {
      type: String,
      trim: true,
      required: true,
    },
    availableOffers: [
      {
        title: {
          type: String,
          default: "",
        },
        offer: {
          type: String,
          default: "",
        },
      },
    ],
    warranty: {
      type: String,
      required: true,
      trim: true,
    },
    sellerAndPolicies: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      policies: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        validate: (v: any) => Array.isArray(v) && v.length > 0,
      },
    },

    highlights: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      validate: (v: any) => Array.isArray(v) && v.length > 0,
    },
    descriptions: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    specifications: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        specification: [
          {
            title: {
              type: String,
              trim: true,
              required: true,
            },
            content: {
              type: String,
              trim: true,
              required: true,
            },
          },
        ],
      },
    ],
    manufactureAndOtherInfo: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
