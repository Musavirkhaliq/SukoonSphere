import { CommentSection } from "@/components/shared/Comments";
import { useOutletContext } from "react-router-dom";

const CommentsOutlet = () => {
  const { addComment, handleDeleteComment, comments, handleLikeComment } =
    useOutletContext();
  return (
    <div>
      <CommentSection
        addComment={addComment}
        comments={comments}
        handleDeleteComment={handleDeleteComment}
        handleLikeComment={handleLikeComment}
      />
    </div>
  );
};
export default CommentsOutlet;
