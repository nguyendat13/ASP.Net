//using Microsoft.EntityFrameworkCore;
//using PhatDat_TH2.Data;
//using PhatDat_TH2.Model;
//using PhatDat_TH2.Model.DTO;
//using PhatDat_TH2.Model.Request;
//using PhatDat_TH2.Services.IServices;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace PhatDat_TH2.Services
//{
//    public class OrderService : IOrderService
//    {
//        private readonly AppDbContext _context;
//        public OrderService(AppDbContext context) => _context = context;

//        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
//        {
//            return await _context.Orders
//                .Where(o => o.StatusOrderId != 4)
//                .Include(o => o.User)
//                .Include(o => o.StatusOrder)
//                .Include(o => o.OrderDetails)
//                    .ThenInclude(od => od.Product)
//                .ToListAsync();
//        }

//        public async Task<Order> GetOrderByIdAsync(int id)
//        {
//            return await _context.Orders
//                .Include(o => o.User)
//                .Include(o => o.StatusOrder)
//                .Include(o => o.OrderDetails)
//                    .ThenInclude(od => od.Product)
//                .FirstOrDefaultAsync(o => o.Id == id && o.StatusOrderId != 4);
//        }

//        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId)
//        {
//            return await _context.Orders
//                .Where(o => o.UserId == userId && o.StatusOrderId != 4)
//                .Include(o => o.User)
//                .Include(o => o.StatusOrder)
//                .Include(o => o.Method)
//                .Include(o => o.OrderDetails)
//                    .ThenInclude(od => od.Product)
//                .ToListAsync();
//        }

//        public async Task<Order> CreateOrderAsync(OrderRequest request)
//        {
//            var user = await _context.Users.FindAsync(request.UserId);
//            if (user == null) throw new Exception("Không tìm thấy user");

//            var order = new Order
//            {
//                CustomerName = user.Fullname,
//                UserId = request.UserId,
//                Email = user.Email,
//                Phone = request.Phone,
//                Address = request.Address,
//                OrderDate = DateTime.Now,
//                CreatedAt = DateTime.Now,
//                CreatedBy = "System",
//                StatusOrderId = 1,
//                MethodId = request.MethodId,
//                OrderDetails = new List<OrderDetail>()
//            };

//            decimal totalPrice = 0;

//            foreach (var item in request.Items)
//            {
//                var product = await _context.Products.FindAsync(item.ProductId);
//                if (product == null) throw new Exception($"Không tìm thấy sản phẩm {item.ProductId}");

//                var priceSale = product.Price - (product.Price * product.Discount / 100m);
//                totalPrice += priceSale * item.Quantity;

//                order.OrderDetails.Add(new OrderDetail
//                {
//                    ProductId = product.Id,
//                    ProductName = product.Name,
//                    Quantity = item.Quantity,
//                    Price = product.Price,
//                    Discount = product.Discount,
//                    PriceSale = priceSale
//                });
//            }

//            order.TotalPrice = totalPrice;
//            _context.Orders.Add(order);
//            await _context.SaveChangesAsync();

//            return order;
//        }

//        public async Task<Order> UpdateOrderAsync(int id, OrderUpdateDTO dto)
//        {
//            var order = await _context.Orders.Include(o => o.OrderDetails).FirstOrDefaultAsync(o => o.Id == id);
//            if (order == null) throw new Exception("Không tìm thấy đơn hàng");

//            order.CustomerName = dto.CustomerName;
//            order.StatusOrderId = dto.StatusOrderId;
//            order.UpdatedAt = DateTime.Now;
//            order.UpdatedBy = "admin";

//            if (dto.Items != null && dto.Items.Any())
//            {
//                _context.OrderDetails.RemoveRange(order.OrderDetails);
//                order.OrderDetails = new List<OrderDetail>();
//                decimal totalPrice = 0;

//                foreach (var item in dto.Items)
//                {
//                    var product = await _context.Products.FindAsync(item.ProductId);
//                    if (product == null) throw new Exception($"Không tìm thấy sản phẩm {item.ProductId}");

//                    var priceSale = product.Price - (product.Price * product.Discount / 100m);
//                    totalPrice += priceSale * item.Quantity;

//                    order.OrderDetails.Add(new OrderDetail
//                    {
//                        ProductId = product.Id,
//                        ProductName = product.Name,
//                        Quantity = item.Quantity,
//                        Price = product.Price,
//                        Discount = product.Discount,
//                        PriceSale = priceSale
//                    });
//                }

//                order.TotalPrice = totalPrice;
//            }

//            await _context.SaveChangesAsync();
//            return order;
//        }

//        public async Task<bool> DeleteOrderAsync(int id)
//        {
//            var order = await _context.Orders.Include(o => o.OrderDetails).FirstOrDefaultAsync(o => o.Id == id);
//            if (order == null) return false;
//            if (order.StatusOrderId != 4) return false;

//            _context.OrderDetails.RemoveRange(order.OrderDetails);
//            _context.Orders.Remove(order);
//            await _context.SaveChangesAsync();
//            return true;
//        }

//        public async Task<bool> CancelOrderAsync(int id)
//        {
//            var order = await _context.Orders.Include(o => o.StatusOrder).FirstOrDefaultAsync(o => o.Id == id);
//            if (order == null || order.StatusOrderId != 1) return false;

//            var canceledStatus = await _context.StatusOrders.FirstOrDefaultAsync(s => s.Name == "Đã hủy");
//            if (canceledStatus == null) return false;

//            order.StatusOrderId = canceledStatus.Id;
//            order.UpdatedAt = DateTime.Now;
//            order.UpdatedBy = "admin";

//            await _context.SaveChangesAsync();
//            return true;
//        }

//        public async Task<IEnumerable<Order>> GetCanceledOrdersByUserIdAsync(int userId)
//        {
//            return await _context.Orders
//                .Include(o => o.User)
//                .Include(o => o.StatusOrder)
//                .Where(o => o.StatusOrderId == 4 && o.UserId == userId)
//                .ToListAsync();
//        }
//    }
//}
