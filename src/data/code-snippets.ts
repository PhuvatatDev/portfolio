/**
 * Real Dart/Flutter code snippets for terminal cells in CodeGrid
 * Each snippet is a mini block of real code — recognizable as Flutter
 */
export const codeSnippets: string[] = [
  // Clean Architecture — UseCase
  `class GetDrawUseCase {
  final DrawRepository repo;
  Future<Either<Failure, Draw>> call(String id) =>
      repo.getDrawById(id);
}`,

  // Entity
  `class Draw extends Equatable {
  final String id;
  final List<TarotCard> cards;
  final DateTime createdAt;
  final Interpretation? interpretation;
}`,

  // Cubit
  `class DrawCubit extends Cubit<DrawState> {
  final GetDrawUseCase _getDraw;
  final CreateDrawUseCase _createDraw;

  Future<void> loadDraw(String id) async {
    emit(DrawLoading());
    final result = await _getDraw(id);
    result.fold(
      (failure) => emit(DrawError(failure)),
      (draw) => emit(DrawLoaded(draw)),
    );
  }
}`,

  // Repository interface
  `abstract class DrawRepository {
  Future<Either<Failure, Draw>> getDrawById(String id);
  Future<Either<Failure, void>> saveDraw(Draw draw);
  Stream<List<Draw>> watchAllDraws();
}`,

  // Firebase DataSource
  `class DrawRemoteDataSource {
  final FirebaseFirestore _firestore;

  Future<DrawModel> getDraw(String id) async {
    final doc = await _firestore
        .collection('users')
        .doc(userId)
        .collection('draws')
        .doc(id)
        .get();
    return DrawModel.fromFirestore(doc);
  }
}`,

  // State sealed class
  `sealed class DrawState extends Equatable {}
class DrawInitial extends DrawState {}
class DrawLoading extends DrawState {}
class DrawLoaded extends DrawState {
  final Draw draw;
}
class DrawError extends DrawState {
  final Failure failure;
}`,

  // Cloud Function
  `export const generateInterpretation =
  onCall(async (request) => {
    const { uid } = request.auth;
    const { cards, intention } = request.data;

    await validateQuota(uid);
    const result = await geminiAI.generate({
      cards, intention, lang: "en"
    });
    await incrementQuota(uid);
    return { interpretation: result };
});`,

  // go_router
  `GoRouter router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
      routes: [
        GoRoute(
          path: 'draw/:id',
          builder: (context, state) =>
            DrawPage(id: state.pathParameters['id']!),
        ),
      ],
    ),
  ],
);`,

  // Repository implementation
  `class DrawRepositoryImpl implements DrawRepository {
  final DrawRemoteDataSource remote;
  final NetworkInfo networkInfo;

  @override
  Future<Either<Failure, Draw>> getDrawById(String id) async {
    try {
      final model = await remote.getDraw(id);
      return Right(model.toEntity());
    } on FirebaseException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }
}`,

  // BlocProvider setup
  `MultiBlocProvider(
  providers: [
    BlocProvider(create: (_) => AuthCubit(
      signIn: sl(), signOut: sl(), watchAuth: sl(),
    )),
    BlocProvider(create: (_) => DrawCubit(
      getDraw: sl(), createDraw: sl(),
    )),
    BlocProvider(create: (_) => JournalCubit(
      getEntries: sl(), deleteEntry: sl(),
    )),
  ],
  child: const App(),
)`,

  // Firestore Rules snippet
  `match /users/{userId}/draws/{drawId} {
  allow read: if request.auth.uid == userId;
  allow create: if request.auth.uid == userId
    && request.resource.data.keys().hasAll(
      ['cards', 'intention', 'createdAt']
    );
  allow delete: if request.auth.uid == userId;
}`,

  // Model fromFirestore
  `factory DrawModel.fromFirestore(DocumentSnapshot doc) {
  final data = doc.data() as Map<String, dynamic>;
  return DrawModel(
    id: doc.id,
    cards: (data['cards'] as List)
        .map((c) => TarotCard.fromMap(c))
        .toList(),
    intention: data['intention'] ?? '',
    createdAt: (data['createdAt'] as Timestamp).toDate(),
  );
}`,
];
