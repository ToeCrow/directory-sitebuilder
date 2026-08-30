import { Mark, mergeAttributes } from "@tiptap/core";

export const InternalLink = Mark.create({
  name: "internalLink",
  inclusive: false,
  addAttributes() {
    return {
      articleId: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[data-internal-article-id]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-internal-article-id": HTMLAttributes.articleId,
      }),
      0,
    ];
  },
});
