// test-image-gen.ts
import { getGeneratedImage } from './src/app/actions';

async function test() {
  console.log('Testing image generation...');
  const result = await getGeneratedImage({ prompt: 'A delicious pizza' });
  console.log('Result:', result);
  if (result.success && result.data.imageUrl) {
    console.log('Image generated successfully!');
    // I can't view the image, but I can check if the URL is a data URI
    if (result.data.imageUrl.startsWith('data:')) {
      console.log('Image URL is a data URI as expected.');
    } else {
      console.error('Image URL is not a data URI.');
    }
  } else {
    console.error('Image generation failed.');
  }
}

test();
