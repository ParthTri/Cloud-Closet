import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { SupabaseProvider } from '../../supabase/supabase.service';
import { CategoryService } from '../category/category.service';
import { OutfitService } from '../outfit/outfit.service';
import { ImageDTO } from './interface/image.dto';

describe('ImageService', () => {
  let service: ImageService;
  let mockSupabaseProvider: Partial<SupabaseProvider>;
  let mockCategoryService: Partial<CategoryService>;
  let mockOutfitService: Partial<OutfitService>;

  beforeEach(async () => {
    mockSupabaseProvider = {
      getClient: jest.fn(),
    };
    mockCategoryService = {};
    mockOutfitService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        { provide: SupabaseProvider, useValue: mockSupabaseProvider },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: OutfitService, useValue: mockOutfitService },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  describe('searchImageByKeyWord', () => {
    const mockUserId = 'user123';
    const mockImages: ImageDTO[] = [
      {
        imageId: '1',
        created_at: '2023-01-01',
        rawUrl: 'raw1.jpg',
        processedUrl: 'processed1.jpg',
        userId: mockUserId,
        categories: [{ categoryId: 1, name: 'T-shirt' }, { categoryId: 2, name: 'Casual' }],
      },
      {
        imageId: '2',
        created_at: '2023-01-02',
        rawUrl: 'raw2.jpg',
        processedUrl: 'processed2.jpg',
        userId: mockUserId,
        categories: [{ categoryId: 3, name: 'Pants' }, { categoryId: 4, name: 'Formal' }],
      },
      {
        imageId: '3',
        created_at: '2023-01-03',
        rawUrl: 'raw3.jpg',
        processedUrl: 'processed3.jpg',
        userId: mockUserId,
        categories: [{ categoryId: 5, name: 'Shirt' }, { categoryId: 6, name: 'Business' }],
      },
    ];

    beforeEach(() => {
      jest.spyOn(service, "getImagesByUserId").mockResolvedValue({ data: mockImages, error: null });
    });

    // Test case: return correct all images that match the keyword, error: null
    it('Should return images that match the keyword in their categories', async () => {
      const mockKeyword = 'shirt';

      const result = await service.searchImageByKeyWord(mockKeyword, mockUserId);

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(2);
      expect(result.data[0].imageId).toBe('1');
      expect(result.data[1].imageId).toBe('3');
    });

    // Test case: No images match the key word
    it('Should return an empty array if no images match the keyword', async () => {
      const mockKeyword = 'shoes';

      const result = await service.searchImageByKeyWord(mockKeyword, mockUserId);

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(0);
    });

    // Test case: case-insensitivity
    it('Should return images that match the keyword in their categories', async () => {
        const mockKeyword = 'sHiRt';
  
        const result = await service.searchImageByKeyWord(mockKeyword, mockUserId);
  
        expect(result.error).toBeNull();
        expect(result.data).toHaveLength(2);
        expect(result.data[0].imageId).toBe('1');
        expect(result.data[1].imageId).toBe('3');
      });

    // Return data = null, and error when getImagesByUserId fails
    it('Should return null data and an error if getImagesByUserId fails', async () => {
      const mockKeyword = 'shirt';
      const mockError = new Error('Database error');

      jest.spyOn(service, 'getImagesByUserId').mockResolvedValue({ data: null, error: mockError });

      const result = await service.searchImageByKeyWord(mockKeyword, mockUserId);

      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });

    // Test case: keyword is null
    it('Should return all images when keyword is null', async () => {
        const result = await service.searchImageByKeyWord(null, mockUserId);
  
        expect(result.error).toBeNull();
        expect(result.data).toEqual(mockImages);
      });

    // Test case: keyword is empty string
    it('Should return all images when keyword is an empty string', async () => {
        const result = await service.searchImageByKeyWord('', mockUserId);
  
        expect(result.error).toBeNull();
        expect(result.data).toEqual(mockImages);
      });
    
  });
});