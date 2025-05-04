import { postDescriptionSelector } from "../data/selectors";

export function hidePost(post, category) {
  console.log("Linkedout: Hiding post");

  const descriptionDiv = post.querySelector(postDescriptionSelector);
  descriptionDiv.innerText = `!!! This Post Is Hidden as it falls in the ${category} category !!! \n\n${descriptionDiv.innerText}`;
  descriptionDiv.style.overflow = "visible";
  descriptionDiv.style.maxHeight = "none";
}
