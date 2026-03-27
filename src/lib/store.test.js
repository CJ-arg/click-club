import { createPost, getAllPosts, getPost, likePost, deletePost } from './store';

describe('Store', () => {
  beforeEach(async () => {
    // Clear the store before each test by getting all posts and deleting them.
    const posts = await getAllPosts();
    for (const post of posts) {
      await deletePost(post.id);
    }
  });

  it('should create and retrieve a post', async () => {
    const newPost = await createPost({
      id: 'post_1',
      name: 'Test User',
      url: 'https://linkedin.com/in/test',
      category: 'fullstack'
    });

    expect(newPost).toHaveProperty('id', 'post_1');
    expect(newPost).toHaveProperty('name', 'Test User');
    
    const retrieved = await getPost('post_1');
    expect(retrieved).not.toBeNull();
    expect(retrieved.name).toBe('Test User');
  });

  it('should get all posts sorted by creation date (newest first)', async () => {
    jest.useFakeTimers('modern');
    await createPost({ id: 'post_1', name: 'User 1', url: 'https://linkedin.com/in/test1', category: 'fullstack' });
    
    // Advance time by 10ms to ensure a different createdAt timestamp
    jest.advanceTimersByTime(10);
    
    await createPost({ id: 'post_2', name: 'User 2', url: 'https://linkedin.com/in/test2', category: 'fullstack' });
    
    const allPosts = await getAllPosts();
    expect(allPosts.length).toBe(2);
    // User 2 was created last, so it should be first in the array.
    expect(allPosts[0].id).toBe('post_2');
    expect(allPosts[1].id).toBe('post_1');
    
    jest.useRealTimers();
  });

  it('should allow liking a post and prevent duplicate likes', async () => {
    await createPost({ id: 'post_1', name: 'User 1', url: 'https://linkedin.com/in/test1', category: 'fullstack' });
    
    // First like
    let post = await likePost('post_1', 'visitor_1');
    expect(post.likes).toBe(1);
    expect(post.likedBy).toContain('visitor_1');

    // Duplicate like
    post = await likePost('post_1', 'visitor_1');
    expect(post.likes).toBe(1); // Should remain 1

    // Different visitor like
    post = await likePost('post_1', 'visitor_2');
    expect(post.likes).toBe(2);
  });

  it('should return null when liking a non-existent post', async () => {
    const post = await likePost('non_existent', 'visitor_1');
    expect(post).toBeNull();
  });

  it('should delete a post', async () => {
    await createPost({ id: 'post_1', name: 'User 1', url: 'https://linkedin.com/in/test1', category: 'fullstack' });
    await deletePost('post_1');
    const post = await getPost('post_1');
    expect(post).toBeNull();
  });
});
