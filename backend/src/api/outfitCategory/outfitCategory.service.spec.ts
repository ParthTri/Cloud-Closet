import { Test, TestingModule } from '@nestjs/testing';
import { OutfitCategoryService } from './outfitCategory.service';
import { SupabaseProvider } from '../../supabase/supabase.service';


describe('OutfitCategoryService', () => {
  let service: OutfitCategoryService;
  let supabaseProviderMock: jest.Mocked<SupabaseProvider>;

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    supabaseProviderMock = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutfitCategoryService,
        {
          provide: SupabaseProvider,
          useValue: supabaseProviderMock,
        },
      ],
    }).compile();

    service = module.get<OutfitCategoryService>(OutfitCategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case: Return correct outfit category name of an correct input outfit category id which is in the database
  describe('getOutfitCategoryName', () => {
    it('Should return category name when given correct input', async () => {
      // Arrange
      const categoryId = 1;
      const expectedName = 'Spring';
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: [{ name: expectedName }],
        error: null,
      });

      // Act
      const result = await service.getOutfitCategoryName(categoryId);

      // Assert
      expect(result.data).toBe(expectedName);
      expect(result.error).toBeNull();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('OutfitCategory');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('name');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', categoryId);
    });

    // Test case: There is no given outfitCategoryId
    // Return should be {data: null, error: null}
    it('should return null when no category exists for given ID', async () => {
      // Arrange
      const categoryId = 999;
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      // Act
      const result = await service.getOutfitCategoryName(categoryId);

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('OutfitCategory');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('name');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', categoryId);
    });

    // Test case: input is a non-numeric
    // return value should be {data:null, error: null}

    it('should handle non-numeric input by trying to convert to number', async () => {
        // Arrange
        const invalidInput = 'abc' as any; // Simulating invalid input
        mockSupabaseClient.eq.mockResolvedValueOnce({
          data: [],
          error: null,
        });
  
        // Act
        const result = await service.getOutfitCategoryName(invalidInput);
  
        // Assert
        expect(result.data).toBeNull();
        expect(result.error).toBeNull();
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('OutfitCategory');
        expect(mockSupabaseClient.select).toHaveBeenCalledWith('name');
        expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', NaN);
      });

    // Test case: Can't connect to the database
    it('should handle database connection errors', async () => {
      // Arrange
      const categoryId = 1;
      const connectionError = new Error('Could not connect to database');
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: connectionError,
      });

      // Act
      const result = await service.getOutfitCategoryName(categoryId);

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBe(connectionError);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('OutfitCategory');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('name');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', categoryId);
    });

    
  });
});