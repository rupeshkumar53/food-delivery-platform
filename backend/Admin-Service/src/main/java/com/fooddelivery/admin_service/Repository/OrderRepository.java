//
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.List;
//
//public interface OrderRepository extends JpaRepository<Order, Long> {
//
//    List<Order> findAllByOrderByPlacedAtDesc();
//
//    @Query("SELECT COUNT(o) FROM Order o WHERE o.status NOT IN :statuses")
//    long countByStatusNotIn(@Param("statuses") List<OrderStatus> statuses);
//
//    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = :status")
//    double sumTotalAmountByStatus(@Param("status") OrderStatus status);
//}