const keywords = [
  "apply now",
  "i'm hiring",
  "now hiring",
  "job opening",
  "job vacancy",
  "hiring",
  "vacancy",
  "join our team",
  "career start",
  "job opportunity",
  "recruitment consultants",
  "we are hiring",
  "employment opportunity",
  "looking for a",
  "we're hiring",
  "#hiring",
  "#job",
  "#vacancy",
  "#jobopening",
  "#jobvacancy",
  "#hiringnow",
  "we're hiring",
  "now hiring",
  "join our team",
  "looking to hire",
  "hiring for",
  "open role",
  "open position",
  "available position",
  "we're expanding our team",
  "send your resume",
  "accepting applications",
  "career opportunity",
  "start your career",
  "join our company",
  "interested candidates",
  "submit your application",
  "looking for a developer",
  "is currently seeking",
  "dummyone",
  "dummytwo",
  "dummythree",
  "dummyfour",
  "dummyfive",
  "dummysix",
  "dummyseven",
  "dummyeight",
  "dummynine",
  "dummyten",
  "dummyeleven",
  "dummytwelve",
  "dummythirteen",
  "dummyfourteen",
  "dummyfifteen",
  "dummy sixteen",
  "dummy seventeen",
  "dummy eighteen",
  "dummy nineteen",
  "is seeking",
];

const regex = new RegExp(
  keywords.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "i"
);

const text = `
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid, laboriosam repudiandae reiciendis est, tempora facilis non accusamus earum deleniti corrupti laudantium eveniet! Ad sequi consequatur perspiciatis aperiam, praesentium aliquam facere commodi! Ab praesentium aliquam, placeat explicabo sed, voluptatum exercitationem provident nemo fugit consectetur iure, eligendi pariatur voluptates illo autem architecto dignissimos iste consequuntur neque dicta quidem! Tenetur veritatis nulla blanditiis fugiat voluptatibus aliquam dignissimos facere necessitatibus natus velit dolores doloribus quam suscipit, molestias aliquid non odio eius excepturi ducimus illum, pariatur ipsa similique sit tempore! Assumenda numquam voluptatum at enim autem saepe, quaerat voluptates quia impedit quis harum illo odio natus quisquam dolorum, facilis temporibus veniam cumque odit molestiae culpa consequuntur corrupti blanditiis sed? Eaque hic minima rerum, labore dolor quia eos quibusdam veniam consectetur distinctio deleniti fugiat saepe exercitationem blanditiis cum vitae autem, soluta, nihil mollitia quasi quo praesentium beatae. Veritatis reiciendis recusandae deleniti rerum possimus molestiae officiis dolore voluptatibus tempore consequuntur ea error assumenda quos, nobis quam nihil repudiandae dicta ab laborum enim quae eius expedita ad sunt! Suscipit, ad sequi recusandae reprehenderit sint dolorem enim. Aperiam asperiores quibusdam sapiente sint adipisci porro, sunt vero. Ducimus impedit eligendi libero omnis consequuntur neque maxime deserunt non, nemo iste dolorem quos ratione voluptatem iure quam soluta beatae saepe fugiat ex aut architecto accusantium. Asperiores consectetur aspernatur dolores explicabo nobis delectus molestiae, aliquid commodi quos, optio ipsa. Repudiandae in inventore, minima unde minus dignissimos obcaecati? Fugiat quidem voluptatibus rem pariatur nobis porro, commodi aliquam ducimus quisquam magnam itaque quasi obcaecati! Aspernatur hic voluptatum in, ratione commodi laudantium cupiditate vitae eius, ea atque voluptatibus quidem animi, totam libero tenetur blanditiis nostrum quo eos temporibus. Aspernatur molestias ipsam illum? Quae ut quam magnam nulla quibusdam eaque sapiente ipsa ab esse animi quaerat id, distinctio consequuntur, nostrum quos. Adipisci cupiditate a consectetur tenetur fugit. praesentium beatae. Veritatis reiciendist is seeking`; // ← 500 words total, with match at the end

function includesMatch(text) {
  for (const kw of keywords) {
    if (text.includes(kw)) return true;
  }
  return false;
}

function regexMatch(text) {
  return regex.test(text);
}

console.time("includes");
for (let i = 0; i < 10000; i++) {
  includesMatch(text);
}
console.timeEnd("includes");

console.time("regex");
for (let i = 0; i < 10000; i++) {
  regexMatch(text);
}
console.timeEnd("regex");
