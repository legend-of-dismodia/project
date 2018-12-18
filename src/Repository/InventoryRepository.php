<?php

namespace App\Repository;

use App\Entity\Save;
use App\Entity\Inventory;
use App\Entity\Item;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\ORM\Query\Expr\Join;
use Symfony\Component\Form\Tests\Fixtures\Type;

/**
 * @method Inventory|null find($id, $lockMode = null, $lockVersion = null)
 * @method Inventory|null findOneBy(array $criteria, array $orderBy = null)
 * @method Inventory[]    findAll()
 * @method Inventory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InventoryRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Inventory::class);
    }

    // /**
    //  * @return Inventory[] Returns an array of Inventory objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Inventory
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    public function getPlayerInventory($saveId)
    {
        // return $this->createQueryBuilder('q')
        //     ->select('item.name', 'item.property', 'item.rarety', 'item.image', 'q.quantity')
        //     ->from('q.Inventory', 'i')
        //     ->innerJoin('q.save','s', Join::ON, 'i.save_id = s.id')
        //     ->innerJoin('q.item','it', Join::ON, 'i.item_id = it.id')            
        //     ->getQuery()
        //     ->getResult()
        // ;
        
        $rawSql = "SELECT item.name, item.property, item.rarety, item.image, inventory.quantity FROM inventory 
        INNER JOIN save ON inventory.save_id = save.id
        INNER JOIN item ON inventory.item_id = item.id
        WHERE inventory.save_id = :saveId";       

        $stmt = $this->getEntityManager()->getConnection()->prepare($rawSql);  
        $stmt->bindValue('saveId', $saveId);
        $stmt->execute();
    
        return $stmt->fetchAll();

    }
}
