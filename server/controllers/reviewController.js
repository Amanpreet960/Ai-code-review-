import { createReview } from '../services/reviewService.js';

const supported = new Set([
'javascript',
'typescript',
'python',
'java',
'c',
'cpp',
'csharp',
'go',
'rust',
'swift',
'kotlin',
'php',
'ruby',
'html',
'css',
'sql',
'shell',
'dockerfile',
'yaml',
'json',
'markdown'
]);


export async function reviewCode(req,res,next) {

try {

const { language, code } = req.body || {};


if (!supported.has(String(language).toLowerCase())) {
return res.status(400).json({
error:'Choose a supported language.'
});
}


if (typeof code !== 'string' || !code.trim()) {
return res.status(400).json({
error:'Code cannot be empty.'
});
}


if (code.length > 100000) {
return res.status(413).json({
error:'Code exceeds the 100,000 character limit.'
});
}


res.json(
await createReview(
language.toLowerCase(),
code
)
);


} catch (error) {

next(error);

}

}
